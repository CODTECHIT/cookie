import express from 'express';
import { getAllPayments, createPayment, getPaymentReport } from '../controllers/payment.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllPayments);
router.get('/report', protect, adminOnly, getPaymentReport);
router.post('/', protect, createPayment);

export default router;
