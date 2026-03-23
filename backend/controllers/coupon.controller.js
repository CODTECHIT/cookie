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

// POST /api/coupons/validate  (customer applies coupon at checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, userId } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return errorResponse(res, 'Invalid coupon code', 400);
    if (new Date() > coupon.validUntil) return errorResponse(res, 'Coupon has expired', 400);
    if (new Date() < coupon.validFrom) return errorResponse(res, 'Coupon not yet active', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return errorResponse(res, 'Coupon usage limit reached', 400);
    if (cartTotal < coupon.minOrderAmount)
      return errorResponse(res, `Minimum order of ₹${coupon.minOrderAmount} required`, 400);

    let discountAmount =
      coupon.discountType === 'percentage'
        ? (cartTotal * coupon.discountValue) / 100
        : coupon.discountValue;

    if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);

    successResponse(res, { couponId: coupon._id, code: coupon.code, discountAmount, discountType: coupon.discountType }, 'Coupon applied');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
