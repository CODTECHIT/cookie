import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadBannerImage } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);                                                           // public
router.post('/', protect, adminOnly, uploadBannerImage.single('image'), createCategory);
router.put('/:id', protect, adminOnly, uploadBannerImage.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
