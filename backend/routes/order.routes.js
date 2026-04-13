import express from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrderStatus, updateTracking, getMyOrders } from '../controllers/order.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.post('/', [
  protect,
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('customerSnapshot.address.street').notEmpty().withMessage('Street address is required'),
  body('customerSnapshot.address.city').notEmpty().withMessage('City is required'),
  body('customerSnapshot.address.pincode').notEmpty().withMessage('Pincode is required'),
  body('grandTotal').isFloat({ min: 0 }).withMessage('Valid total is required'),
  validate
], createOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/tracking', protect, adminOnly, updateTracking);

export default router;
