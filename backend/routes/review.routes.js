import express from 'express';
import { getAllReviews, createReview, moderateReview } from '../controllers/review.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllReviews);
router.post('/', protect, createReview);
router.patch('/:id/moderate', protect, adminOnly, moderateReview);

export default router;
