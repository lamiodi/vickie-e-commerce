import express from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
router.get('/order/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT * FROM notifications WHERE order_id=$1 ORDER BY sent_at DESC',
    [id]
  );
  res.json(rows);
});
export default router;
