import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner, getSettings, updateSettings } from '../controllers/content.controller.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadBannerImage, uploadLogo } from '../middleware/upload.js';

const router = express.Router();

// Banners
router.get('/banners', getBanners);                                                              // public
router.post('/banners', protect, adminOnly, uploadBannerImage.single('image'), createBanner);
router.put('/banners/:id', protect, adminOnly, uploadBannerImage.single('image'), updateBanner);
router.delete('/banners/:id', protect, adminOnly, deleteBanner);

// Site Settings
router.get('/settings', getSettings);
router.put('/settings', protect, adminOnly, uploadLogo.single('logo'), updateSettings);

export default router;
