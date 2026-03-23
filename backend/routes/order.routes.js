import express from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrderStatus, updateTracking } from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/tracking', protect, adminOnly, updateTracking);

export default router;
