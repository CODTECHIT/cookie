import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import SiteSetting from '../models/SiteSetting.js';
import Banner from '../models/Banner.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * ⚡ Optimized Bootstrap: All initial site data in ONE request
 * Significantly reduces TTFB and overall page load time
 */
export const getSiteBootstrap = async (req, res) => {
  try {
    const [settings, categories, coupons, banners] = await Promise.all([
      SiteSetting.findOne().lean(),
      Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
      Coupon.find({ 
        isActive: true, 
        validUntil: { $gte: new Date() },
        validFrom: { $lte: new Date() }
      }).lean(),
      Banner.find({ isActive: true }).sort({ sortOrder: 1 }).lean()
    ]);

    successResponse(res, {
      settings,
      categories,
      coupons,
      banners
    });
  } catch (err) {
    console.error('❌ Bootstrap Error:', err);
    errorResponse(res, err.message);
  }
};
