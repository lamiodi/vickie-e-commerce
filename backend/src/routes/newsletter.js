import express from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletter.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/', requireAuth, requireAdmin, getSubscribers);

export default router;
