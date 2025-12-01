import express from "express";
import { pool } from "../db/pool.js";
import multer from "multer";
import { sendEmail } from "../services/email.js";
import { logNotification } from "../services/notifications.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Protect all admin routes
router.use(requireAuth);

router.get("/stats", async (req, res) => {
  try {
    // Calculate total revenue
    const revenueRes = await pool.query("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'");
    const totalRevenue = parseFloat(revenueRes.rows[0].total || 0);

    // Count orders
    const ordersRes = await pool.query("SELECT COUNT(*) as count FROM orders");
    const totalOrders = parseInt(ordersRes.rows[0].count || 0);

    // Count customers
    const customersRes = await pool.query("SELECT COUNT(*) as count FROM users");
    const totalCustomers = parseInt(customersRes.rows[0].count || 0);

    // Count products
    const productsRes = await pool.query("SELECT COUNT(*) as count FROM products");
    const totalProducts = parseInt(productsRes.rows[0].count || 0);

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueChange: 5, // Mock change
      ordersChange: 12,
      customersChange: 8,
      productsChange: 2
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.*, u.email, u.name as customer_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC LIMIT 50
    `);
    
    const orders = rows.map(order => ({
      id: order.id,
      total: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      customer: {
        email: order.email,
        firstName: order.customer_name ? order.customer_name.split(' ')[0] : 'Guest',
        lastName: order.customer_name ? order.customer_name.split(' ').slice(1).join(' ') : ''
      }
    }));
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT 50");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", upload.none(), async (req, res) => {
  const { name, description, category, price, attributes, stock, images } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      "INSERT INTO products(name,description,category,price,attributes,created_at) VALUES($1,$2,$3,$4,$5::jsonb,now()) RETURNING id",
      [name, description || null, category, price, attributes || "{}"]
    );
    const productId = rows[0].id;

    // Create a default variant if stock provided
    if (stock) {
       await client.query(
        "INSERT INTO product_variants(product_id, stock, images) VALUES($1, $2, $3::jsonb)",
        [productId, stock, images ? JSON.stringify(images) : "[]"]
       );
    }
    
    await client.query('COMMIT');
    res.json({ id: productId });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: "Failed to create product" });
  } finally {
    client.release();
  }
});

router.post("/products/:id/variants", upload.none(), async (req, res) => {
  const { id } = req.params;
  const { size, color, stock, images } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO product_variants(product_id,size,color,stock,images) VALUES($1,$2,$3,$4,$5::jsonb) RETURNING id",
    [id, size || null, color || null, stock || 0, images || "[]"]
  );
  res.json({ id: rows[0].id });
});

router.patch("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, tracking_code } = req.body;
  await pool.query("UPDATE orders SET status=$1, tracking_code=$2 WHERE id=$3", [status, tracking_code || null, id]);
  const orderRes = await pool.query("SELECT user_id,total_amount FROM orders WHERE id=$1", [id]);
  const order = orderRes.rows[0];
  if (order?.user_id) {
    const userRes = await pool.query("SELECT email,name FROM users WHERE id=$1", [order.user_id]);
    const user = userRes.rows[0];
    if (user) {
      if (status === "Processing") {
        await sendEmail({ to: user.email, subject: "Order processing", template: "order_processing", data: { orderId: id, eta: "1-2 days" } });
        await logNotification({ user_id: order.user_id, order_id: id, type: "processing", message: "Order is processing" });
      } else if (status === "Shipped") {
        await sendEmail({ to: user.email, subject: "Order shipped", template: "order_shipped", data: { orderId: id, trackingUrl: tracking_code ? `https://track.example/${tracking_code}` : "#", trackingCode: tracking_code || "" } });
        await logNotification({ user_id: order.user_id, order_id: id, type: "shipped", message: `Tracking ${tracking_code || ""}` });
      } else if (status === "Delivered") {
        await sendEmail({ to: user.email, subject: "Order delivered", template: "order_delivered", data: { orderId: id } });
        await logNotification({ user_id: order.user_id, order_id: id, type: "delivered", message: "Order delivered" });
      }
    }
  }
  res.json({ ok: true });
});

export default router;
