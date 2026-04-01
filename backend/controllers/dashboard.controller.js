import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const { view = "daily", date, month } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const selectedDate = date ? new Date(date) : new Date();
    selectedDate.setHours(0, 0, 0, 0);

    const selectedMonth = month ? new Date(`${month}-01`) : new Date();
    selectedMonth.setDate(1);
    selectedMonth.setHours(0, 0, 0, 0);

    const periodStart = view === "monthly" ? selectedMonth : selectedDate;
    const periodEnd = new Date(periodStart);
    if (view === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 1);
    }

    const periodDurationMs = periodEnd.getTime() - periodStart.getTime();
    const previousPeriodEnd = new Date(periodStart);
    const previousPeriodStart = new Date(
      periodStart.getTime() - periodDurationMs,
    );

    const [
      totalOrders,
      todayOrders,
      totalSalesResult,
      todaySalesResult,
      periodOrders,
      periodSalesResult,
      previousPeriodOrders,
      previousPeriodSalesResult,
      lowStockProducts,
      totalCustomers,
      pendingOrders,
      salesHistory,
      topPerformingProducts,
      signUpUsers,
      failedPayments,
      growthTrends,
      businessAnalysis,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),

      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),

      Order.aggregate([
        { $match: { paymentStatus: "Paid", createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),

      Order.countDocuments({
        paymentStatus: "Paid",
        createdAt: { $gte: periodStart, $lt: periodEnd },
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: periodStart, $lt: periodEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),

      Order.countDocuments({
        paymentStatus: "Paid",
        createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),

      Product.find({ isLowStock: true })
        .select("name totalStock variants")
        .limit(10),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments({ status: "Pending" }),

      // Selected period sales (single day or single month)
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: { $gte: periodStart, $lt: periodEnd },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: view === "monthly" ? "%Y-%m-%d" : "%H:00",
                date: "$createdAt",
              },
            },
            sales: { $sum: "$grandTotal" },
            orders: { $count: {} },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top performing products (dynamic, based on actual sales)
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalQuantity: { $sum: "$items.quantity" },
            totalRevenue: { $sum: "$items.totalPrice" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
      ]),

      // Sign-up users (accountable tracking)
      User.aggregate([
        { $match: { role: "customer" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            signups: { $count: {} },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }, // Last 30 days
      ]),

      // Failed payments tracking
      Order.aggregate([
        { $match: { paymentStatus: "Failed", createdAt: { $gte: last7Days } } },
        {
          $group: {
            _id: null,
            count: { $count: {} },
            totalAmount: { $sum: "$grandTotal" },
          },
        },
      ]),

      // Growth trends (month over month)
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            sales: { $sum: "$grandTotal" },
            orders: { $count: {} },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 6 },
      ]),

      // Strategic business analysis (based on sales performance)
      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
          $facet: {
            byPaymentMethod: [
              {
                $group: {
                  _id: "$paymentMethod",
                  count: { $count: {} },
                  revenue: { $sum: "$grandTotal" },
                },
              },
            ],
            byStatus: [
              {
                $group: {
                  _id: "$status",
                  count: { $count: {} },
                  revenue: { $sum: "$grandTotal" },
                },
              },
            ],
            conversionMetrics: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $count: {} },
                  averageOrderValue: { $avg: "$grandTotal" },
                  totalRevenue: { $sum: "$grandTotal" },
                },
              },
            ],
          },
        },
      ]),
    ]);

    // Format chart data based on selected view (ensure all slots exist)
    const chartData = [];
    if (view === "monthly") {
      const daysInMonth = new Date(
        selectedMonth.getFullYear(),
        selectedMonth.getMonth() + 1,
        0,
      ).getDate();

      for (let day = 1; day <= daysInMonth; day += 1) {
        const dayDate = new Date(
          selectedMonth.getFullYear(),
          selectedMonth.getMonth(),
          day,
        );
        const dateStr = dayDate.toISOString().split("T")[0];
        const found = salesHistory.find((s) => s._id === dateStr);
        chartData.push({
          date: dateStr,
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    } else {
      for (let hour = 0; hour < 24; hour += 1) {
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        const found = salesHistory.find((s) => s._id === hourLabel);
        chartData.push({
          date: hourLabel,
          sales: found ? found.sales : 0,
          orders: found ? found.orders : 0,
        });
      }
    }

    // Format sign-up data (last 30 days)
    const signupData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const found = signUpUsers.find((s) => s._id === dateStr);
      signupData.push({
        date: dateStr,
        signups: found ? found.signups : 0,
      });
    }

    // Total signups in last 30 days
    const totalSignups = signupData.reduce((sum, day) => sum + day.signups, 0);

    const currentPeriodSales = periodSalesResult[0]?.total || 0;
    const previousPeriodSales = previousPeriodSalesResult[0]?.total || 0;

    const calculateTrend = (currentValue, previousValue) => {
      if (previousValue === 0) {
        return currentValue > 0 ? 100 : 0;
      }
      return Number(
        (((currentValue - previousValue) / previousValue) * 100).toFixed(1),
      );
    };

    successResponse(res, {
      // Basic Metrics
      totalOrders,
      todayOrders,
      totalSales: totalSalesResult[0]?.total || 0,
      todaySales: todaySalesResult[0]?.total || 0,
      periodOrders,
      periodSales: currentPeriodSales,
      previousPeriodOrders,
      previousPeriodSales,
      periodOrdersTrend: calculateTrend(periodOrders, previousPeriodOrders),
      periodSalesTrend: calculateTrend(currentPeriodSales, previousPeriodSales),
      totalCustomers,
      totalSignups,
      pendingOrders,
      failedPaymentsCount: failedPayments[0]?.count || 0,
      failedPaymentsAmount: failedPayments[0]?.totalAmount || 0,

      // Charts & Trends
      chartData,
      signupData,
      growthTrends: growthTrends.reverse(),
      selectedView: view,
      selectedDate: selectedDate.toISOString().split("T")[0],
      selectedMonth: `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`,

      // Products & Inventory
      lowStockProducts,
      topPerformingProducts: topPerformingProducts.map((product) => ({
        _id: product._id,
        totalQuantitySold: product.totalQuantity,
        totalRevenue: product.totalRevenue,
        orderCount: product.orderCount,
        productInfo: product.productInfo[0] || null,
      })),

      // Business Analysis
      businessAnalysis: {
        byPaymentMethod: businessAnalysis[0]?.byPaymentMethod || [],
        byStatus: businessAnalysis[0]?.byStatus || [],
        conversionMetrics: businessAnalysis[0]?.conversionMetrics[0] || {
          totalOrders: 0,
          averageOrderValue: 0,
          totalRevenue: 0,
        },
      },
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};
