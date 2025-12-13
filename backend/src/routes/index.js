import express from 'express';
import adminRoutes from './admin.js';
const router = express.Router();
router.use('/admin', adminRoutes);
export default router;
