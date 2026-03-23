import express from 'express';
import { getShippingZones, createShippingZone, updateShippingZone, deleteShippingZone, checkPincode } from '../controllers/shipping.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getShippingZones);
router.post('/', protect, adminOnly, createShippingZone);
router.put('/:id', protect, adminOnly, updateShippingZone);
router.delete('/:id', protect, adminOnly, deleteShippingZone);
router.post('/check-pincode', checkPincode);   // public — customer checks delivery

export default router;
