import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock, createProductReview, getProductReviews } from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getProducts);                                                                       // public
router.get('/:id', getProductById);                                                                 // public
router.post('/', [
  protect, 
  adminOnly, 
  uploadProductImages.array('images', 5),
  body('name').notEmpty().withMessage('Product name is required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('variants').notEmpty().withMessage('At least one variant is required'),
  validate
], createProduct);

router.put('/:id', [
  protect, 
  adminOnly, 
  uploadProductImages.array('images', 5),
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  validate
], updateProduct);

router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.get('/:id/reviews', getProductReviews);                                                      // public
router.post('/:id/reviews', [
  protect,
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Review comment is required'),
  validate
], createProductReview);                                          // customer

export default router;
