import express from 'express';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { checkoutLimiter } from '../middleware/rateLimit.js';

const router = express.Router();
const stripe = new Stripe(env.stripeSecret || 'sk_test_placeholder');

router.post('/create-payment-intent', requireAuth, checkoutLimiter, async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  try {
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
