import { pool } from '../db/pool.js';
export const logNotification = async ({ user_id, order_id, type, message }) => {
  await pool.query(
    'INSERT INTO notifications(user_id, order_id, type, message, sent_at) VALUES($1,$2,$3,$4, now())',
    [user_id || null, order_id || null, type, message || null]
  );
};
export const lastNotificationForOrder = async (order_id) => {
  const { rows } = await pool.query(
    'SELECT type, sent_at FROM notifications WHERE order_id=$1 ORDER BY sent_at DESC LIMIT 1',
    [order_id]
  );
  return rows[0] || null;
};
