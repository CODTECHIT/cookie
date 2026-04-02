import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    successResponse(res, coupons);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/coupons  (admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    successResponse(res, coupon, 'Coupon created', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PUT /api/coupons/:id  (admin)
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return errorResponse(res, 'Coupon not found', 404);
    successResponse(res, coupon, 'Coupon updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// DELETE /api/coupons/:id  (admin)
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    successResponse(res, null, 'Coupon deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

/**
 * Internal logic for validating coupon
 */
export const validateCouponInternal = async (code, cartTotal, userId) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) return { success: false, message: 'Invalid coupon code' };
  if (new Date() > coupon.validUntil) return { success: false, message: 'Coupon has expired' };
  if (new Date() < coupon.validFrom) return { success: false, message: 'Coupon not yet active' };
  
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    return { success: false, message: 'Coupon usage limit reached' };

  if (userId && coupon.perUserLimit) {
      const Order = (await import('../models/Order.js')).default;
      const userUsageCount = await Order.countDocuments({ 
          customerId: userId, 
          couponId: coupon._id,
          paymentStatus: { $ne: 'Failed' }
      });
      if (userUsageCount >= coupon.perUserLimit) {
          return { success: false, message: `You've already used this coupon ${userUsageCount} times` };
      }
  }

  if (cartTotal < coupon.minOrderAmount)
    return { success: false, message: `Minimum order of ₹${coupon.minOrderAmount} required` };

  let discountAmount =
    coupon.discountType === 'percentage'
      ? (cartTotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);

  return {
    success: true,
    data: { couponId: coupon._id, code: coupon.code, discountAmount, discountType: coupon.discountType }
  };
};

// POST /api/coupons/validate  (customer applies coupon at checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, userId } = req.body;
    const result = await validateCouponInternal(code, cartTotal, userId);
    
    if (result.success) {
      successResponse(res, result.data, 'Coupon applied');
    } else {
      errorResponse(res, result.message, 400);
    }
  } catch (err) {
    errorResponse(res, err.message);
  }
};
