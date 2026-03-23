import express from 'express';
import { getSalesReport, getBestSellers } from '../controllers/report.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/sales', protect, adminOnly, getSalesReport);
router.get('/best-sellers', protect, adminOnly, getBestSellers);

export default router;
