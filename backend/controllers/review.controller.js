import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/reviews  (admin — all reviews with filter)
export const getAllReviews = async (req, res) => {
  try {
    const { status, productId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .populate('productId', 'name')
      .populate('customerId', 'name phone')
      .skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    successResponse(res, reviews);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/reviews  (customer submits review)
export const createReview = async (req, res) => {
  try {
    const { productId, customerId, orderId, rating, title, comment } = req.body;
    const review = await Review.create({ productId, customerId, orderId, rating, title, comment, isVerifiedPurchase: !!orderId });
    successResponse(res, review, 'Review submitted', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PATCH /api/reviews/:id/moderate  (admin — approve or reject)
export const moderateReview = async (req, res) => {
  try {
    const { status } = req.body;   // "Approved" | "Rejected"
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status, moderatedBy: req.user._id, moderatedAt: new Date() },
      { new: true }
    );
    if (!review) return errorResponse(res, 'Review not found', 404);

    // Recalculate product rating when a review is approved
    if (status === 'Approved') {
      const agg = await Review.aggregate([
        { $match: { productId: review.productId, status: 'Approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (agg[0]) {
        await Product.findByIdAndUpdate(review.productId, {
          avgRating: Math.round(agg[0].avg * 10) / 10,
          reviewCount: agg[0].count,
        });
      }
    }
    successResponse(res, review, `Review ${status}`);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// DELETE /api/reviews/:id  (admin — delete a review)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 'Review not found', 404);

    const productId = review.productId;
    await review.deleteOne();

    // Recalculate product rating
    const agg = await Review.aggregate([
      { $match: { productId, status: 'Approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(productId, {
      avgRating: agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0,
      reviewCount: agg[0] ? agg[0].count : 0,
    });

    successResponse(res, null, 'Review deleted');
  } catch (err) {
    errorResponse(res, err.message);
  }
};
