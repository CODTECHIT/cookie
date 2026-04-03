import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import SiteSetting from '../models/SiteSetting.js';
import Banner from '../models/Banner.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * ⚡ Optimized Bootstrap: All initial site data in ONE request
 * Now includes Home Page products for instant rendering
 */
export const getSiteBootstrap = async (req, res) => {
  try {
    const [settings, categories, coupons, banners, featuredProducts, bestSellers] = await Promise.all([
      SiteSetting.findOne().lean(),
      Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
      Coupon.find({ 
        isActive: true, 
        validUntil: { $gte: new Date() },
        validFrom: { $lte: new Date() }
      }).lean(),
      Banner.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
      // ⚡ HOME PAGE BOOST: Fetch featured and latest products for instant display
      Product.find({ isFeatured: true, isActive: true }).limit(10).lean(),
      Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(12).lean()
    ]);

    successResponse(res, {
      settings,
      categories,
      coupons,
      banners,
      featuredProducts,
      bestSellers
    });
  } catch (err) {
    console.error('❌ Bootstrap Error:', err);
    errorResponse(res, err.message);
  }
};
