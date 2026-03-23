import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalSalesResult,
      todaySalesResult,
      lowStockProducts,
      totalCustomers,
      pendingOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),

      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),

      Order.aggregate([
        { $match: { paymentStatus: 'Paid', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } },
      ]),

      Product.find({ isLowStock: true }).select('name totalStock variants').limit(10),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ status: 'Pending' }),
    ]);

    successResponse(res, {
      totalOrders,
      todayOrders,
      totalSales: totalSalesResult[0]?.total || 0,
      todaySales: todaySalesResult[0]?.total || 0,
      lowStockProducts,
      totalCustomers,
      pendingOrders,
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};
