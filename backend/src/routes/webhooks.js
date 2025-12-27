import express from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { sendEmail } from '../services/email.js';
import { logNotification } from '../services/notifications.js';
const router = express.Router();
const stripe = new Stripe(env.stripeSecret || '');
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.stripeWebhookSecret);
  } catch {
    return res.status(400).send(`Webhook Error`);
  }
  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const { rows } = await pool.query(
      'SELECT id,user_id,total_amount FROM orders WHERE stripe_payment_id=$1',
      [pi.id]
    );
    if (rows.length) {
      const order = rows[0];
      await pool.query("UPDATE orders SET status='Processing' WHERE id=$1", [order.id]);
      if (order.user_id) {
        const user = await pool.query('SELECT email,name FROM users WHERE id=$1', [order.user_id]);
        if (user.rows.length) {
          await sendEmail({
            to: user.rows[0].email,
            subject: 'Order confirmation',
            template: 'order_confirmation',
            data: {
              name: user.rows[0].name || 'Customer',
              orderId: order.id,
              total: `$${order.total_amount}`,
            },
          });
          await logNotification({
            user_id: order.user_id,
            order_id: order.id,
            type: 'order_confirmation',
            message: 'Payment confirmed',
          });
        }
      }
    }
  }
  res.json({ received: true });
});
export default router;
