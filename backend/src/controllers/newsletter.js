import { pool } from '../db/pool.js';

export const subscribe = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if email already exists
    const existing = await pool.query('SELECT * FROM subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    await pool.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
    res.status(201).json({ message: 'Successfully subscribed' });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM subscribers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};
