import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/reports/sales  (daily or monthly)
export const getSalesReport = async (req, res) => {
  try {
    const { period = 'daily', from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const groupId =
      period === 'monthly'
        ? { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
        : { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } };

    const report = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'Paid',
          ...(from || to ? { createdAt: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          onlineRevenue: { $sum: { $cond: [{ $ne: ['$paymentMethod', 'COD'] }, '$grandTotal', 0] } },
          codRevenue: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'COD'] }, '$grandTotal', 0] } },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
    ]);

    successResponse(res, report);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/best-sellers
export const getBestSellers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.find({ isActive: true })
      .sort({ totalSold: -1 })
      .limit(Number(limit))
      .select('name images totalSold avgRating variants categoryId')
      .populate('categoryId', 'name');
    successResponse(res, products);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
