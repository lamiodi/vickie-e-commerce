import express from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { pool } from '../db/pool.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { authLimiter } from '../middleware/rateLimit.js';
import cookieParser from 'cookie-parser';
import { sendEmail } from '../services/email.js';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(cookieParser());

const validators = [body('email').isEmail(), body('password').isLength({ min: 8 })];

router.get('/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, role, is_verified, created_at FROM users WHERE id=$1',
      [req.user.sub]
    );
    if (!rows.length) return res.status(404).json({ error: 'user_not_found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'server_error' });
  }
});

router.post('/register', authLimiter, validators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password, name } = req.body;
  const hash = await argon2.hash(password);
  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rowCount) return res.status(409).json({ error: 'email_exists' });
    const verifyToken = uuidv4();
    const { rows } = await client.query(
      'INSERT INTO users(email,password_hash,is_verified,created_at,name,verify_token) VALUES($1,$2,false,now(),$3,$4) RETURNING id',
      [email, hash, name || null, verifyToken]
    );
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      template: 'order_processing',
      data: { orderId: rows[0].id, eta: 'Verify' },
    });
    res.json({ ok: true });
  } finally {
    client.release();
  }
});

router.post('/login', authLimiter, validators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const { rows } = await pool.query(
    'SELECT id,password_hash,is_verified FROM users WHERE email=$1',
    [email]
  );
  if (!rows.length) return res.status(401).json({ error: 'invalid_credentials' });
  const user = rows[0];
  const ok = await argon2.verify(user.password_hash, password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const access = signAccessToken({ sub: user.id });
  const refresh = signRefreshToken({ sub: user.id });
  res.cookie('refresh_token', refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 3600 * 1000,
  });
  res.json({ access });
});

router.post('/verify', authLimiter, body('token').isString(), async (req, res) => {
  const { token } = req.body;
  const { rowCount } = await pool.query(
    'UPDATE users SET is_verified=true, verify_token=NULL WHERE verify_token=$1',
    [token]
  );
  if (!rowCount) return res.status(400).json({ error: 'invalid_token' });
  res.json({ ok: true });
});

router.post('/refresh', authLimiter, async (req, res) => {
  const token = req.cookies.refresh_token || null;
  if (!token) return res.status(401).json({ error: 'missing_refresh' });
  try {
    const payload = verifyRefreshToken(token);
    const access = signAccessToken({ sub: payload.sub });
    res.json({ access });
  } catch {
    res.status(401).json({ error: 'invalid_refresh' });
  }
});

router.post('/forgot', authLimiter, body('email').isEmail(), async (req, res) => {
  const { email } = req.body;
  const { rows } = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
  if (!rows.length) return res.json({ ok: true });
  const token = uuidv4();
  await pool.query('UPDATE users SET reset_token=$1, reset_requested_at=now() WHERE id=$2', [
    token,
    rows[0].id,
  ]);
  await sendEmail({
    to: email,
    subject: 'Reset password',
    template: 'order_processing',
    data: { orderId: token, eta: 'Reset' },
  });
  res.json({ ok: true });
});

router.post(
  '/reset',
  authLimiter,
  [body('token').isString(), body('password').isLength({ min: 8 })],
  async (req, res) => {
    const { token, password } = req.body;
    const { rows } = await pool.query('SELECT id FROM users WHERE reset_token=$1', [token]);
    if (!rows.length) return res.status(400).json({ error: 'invalid_token' });
    const hash = await argon2.hash(password);
    await pool.query('UPDATE users SET password_hash=$1, reset_token=NULL WHERE id=$2', [
      hash,
      rows[0].id,
    ]);
    res.json({ ok: true });
  }
);

export default router;
