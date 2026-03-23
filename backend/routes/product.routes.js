import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock } from '../controllers/product.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);                                                                       // public
router.get('/:id', getProductById);                                                                 // public
router.post('/', protect, adminOnly, uploadProductImages.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, uploadProductImages.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.patch('/:id/stock', protect, adminOnly, updateStock);

export default router;
