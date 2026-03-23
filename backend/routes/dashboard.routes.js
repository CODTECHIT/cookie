import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, adminOnly, getDashboard);
export default router;
