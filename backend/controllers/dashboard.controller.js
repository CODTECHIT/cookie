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
      salesHistory
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

      // Last 7 days sales
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'Paid',
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$grandTotal" },
            orders: { $count: {} }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // Format chart data for last 7 days (ensure all days exist)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = salesHistory.find(s => s._id === dateStr);
      chartData.push({
        date: dateStr,
        sales: found ? found.sales : 0,
        orders: found ? found.orders : 0
      });
    }

    successResponse(res, {
      totalOrders,
      todayOrders,
      totalSales: totalSalesResult[0]?.total || 0,
      todaySales: todaySalesResult[0]?.total || 0,
      lowStockProducts,
      totalCustomers,
      pendingOrders,
      chartData
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};
