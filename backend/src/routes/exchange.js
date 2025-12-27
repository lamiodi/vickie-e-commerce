import express from 'express';
import { getExchangeRates } from '../services/exchange.js';

const router = express.Router();

router.get('/rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

export default router;
