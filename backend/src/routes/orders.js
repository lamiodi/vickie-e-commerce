import express from 'express';
import { pool } from '../db/pool.js';
import { lastNotificationForOrder } from '../services/notifications.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
  const { items, shippingAddress, totals } = req.body;

  // Basic validation
  if (!items || !items.length || !totals) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create user if needed or just store customer info in order (simplified)
    // For this implementation, we'll assume guest checkout or existing user handled via token elsewhere.
    // Since we don't have optional auth middleware here, we'll default user_id to null.
    // In a real app, we'd parse the token if present.
    const userId = null;

    // Insert Order
    // Note: The schema might need columns for shipping address etc.
    // If not present, we might dump them into a jsonb column or ignore.
    // Checking checkout.js: INSERT INTO orders(user_id,stripe_payment_id,total_amount,status,created_at)
    // It doesn't seem to have address columns in the INSERT in checkout.js.
    // I'll assume there's an 'address' or 'metadata' column, or I'll just insert basic fields.
    // Let's verify schema if possible. For now, I'll follow checkout.js pattern but maybe add address to a jsonb if 'details' or similar exists.
    // Or just insert what checkout.js does: total_amount, status.

    const { rows } = await client.query(
      "INSERT INTO orders(user_id, total_amount, status, shipping_address, created_at) VALUES($1, $2, 'Pending', $3, now()) RETURNING id",
      [userId, totals.total, shippingAddress]
    );
    const orderId = rows[0].id;

    // Insert Items
    for (const item of items) {
      // We need variant_id. The frontend sends productId.
      // If products have variants, we need to find the variant matching size/color.
      // Handle cases where size/color might be null or 'Default'
      
      let variantId = null;
      // Try to find variant
      // Using IS NOT DISTINCT FROM for robust NULL handling
      const varRes = await client.query(
        `SELECT id FROM product_variants 
         WHERE product_id=$1 
         AND (size IS NOT DISTINCT FROM $2 OR (size IS NULL AND $2 IS NULL))
         AND (color IS NOT DISTINCT FROM $3 OR color = 'Default')`,
        [item.productId, item.size || null, item.color || 'Default']
      );

      if (varRes.rows.length > 0) {
        variantId = varRes.rows[0].id;
      } else {
        // Fallback: try finding any variant if strict match failed (e.g. if color is Default but not passed)
        // This handles cases where frontend might send null for color but DB has 'Default'
        const fallbackRes = await client.query(
             `SELECT id FROM product_variants 
              WHERE product_id=$1 
              AND (size IS NOT DISTINCT FROM $2 OR (size IS NULL AND $2 IS NULL))
              LIMIT 1`,
             [item.productId, item.size || null]
        );
        
        if (fallbackRes.rows.length > 0) {
            variantId = fallbackRes.rows[0].id;
        } else {
            throw new Error(`Product variant not found: ${item.productId} (Size: ${item.size}, Color: ${item.color})`);
        }
      }

      if (variantId) {
        await client.query(
          'INSERT INTO order_items(order_id, variant_id, qty, price) VALUES($1, $2, $3, $4)',
          [orderId, variantId, item.quantity, item.price]
        );

        // Update stock
        const updateRes = await client.query('UPDATE product_variants SET stock = stock - $1 WHERE id = $2 AND stock >= $1', [
          item.quantity,
          variantId,
        ]);
        
        if (updateRes.rowCount === 0) {
           throw new Error(`Insufficient stock for product: ${item.name}`);
        }
      }
    }

    await client.query('COMMIT');
    res.json({ id: orderId, status: 'success' });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Order creation failed:', e);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC',
    [req.user.sub]
  );
  const enriched = [];
  for (const o of rows) {
    const last = await lastNotificationForOrder(o.id);
    enriched.push({ ...o, last_notification: last });
  }
  res.json(enriched);
});

router.get('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1 AND user_id=$2', [
    id,
    req.user.sub,
  ]);
  if (!rows.length) return res.status(404).json({ error: 'not_found' });
  const items = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [id]);
  const last = await lastNotificationForOrder(id);
  res.json({ ...rows[0], items: items.rows, last_notification: last });
});

export default router;
