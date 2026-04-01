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

    // ⚡ OPTIMIZED: Combine all order queries into 2 aggregation pipelines using $facet
    const [orderMetrics, productMetrics, userMetrics] = await Promise.all([
      // All order-related metrics in single query (down from 9 queries → 1)
      Order.aggregate([
        {
          $facet: {
            totalMetrics: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalSales: {
                    $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$grandTotal", 0] },
                  },
                },
              },
            ],
            todayMetrics: [
              {
                $match: { createdAt: { $gte: today } },
              },
              {
                $group: {
                  _id: null,
                  todayOrders: { $sum: 1 },
                  todaySales: {
                    $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$grandTotal", 0] },
                  },
                },
              },
            ],
            periodMetrics: [
              {
                $match: {
                  paymentStatus: "Paid",
                  createdAt: { $gte: periodStart, $lt: periodEnd },
                },
              },
              {
                $group: {
                  _id: null,
                  periodOrders: { $sum: 1 },
                  periodSales: { $sum: "$grandTotal" },
                },
              },
            ],
            previousPeriodMetrics: [
              {
                $match: {
                  paymentStatus: "Paid",
                  createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd },
                },
              },
              {
                $group: {
                  _id: null,
                  previousOrders: { $sum: 1 },
                  previousSales: { $sum: "$grandTotal" },
                },
              },
            ],
            pendingOrders: [
              {
                $match: { status: "Pending" },
              },
              {
                $count: "count",
              },
            ],
            failedPayments: [
              {
                $match: { paymentStatus: "Failed", createdAt: { $gte: last7Days } },
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  totalAmount: { $sum: "$grandTotal" },
                },
              },
            ],
            salesHistory: [
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
                  orders: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            topProducts: [
              { $match: { paymentStatus: "Paid" } },
              { $unwind: "$items" },
              {
                $group: {
                  _id: "$items.productId",
                  totalQuantity: { $sum: "$items.quantity" },
                  totalRevenue: { $sum: "$items.totalPrice" },
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
            ],
            growthTrends: [
              { $match: { paymentStatus: "Paid" } },
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                  sales: { $sum: "$grandTotal" },
                  orders: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } },
              { $limit: 6 },
            ],
            businessAnalysis: [
              { $match: { paymentStatus: "Paid" } },
              {
                $facet: {
                  byPaymentMethod: [
                    {
                      $group: {
                        _id: "$paymentMethod",
                        count: { $sum: 1 },
                        revenue: { $sum: "$grandTotal" },
                      },
                    },
                  ],
                  byStatus: [
                    {
                      $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        revenue: { $sum: "$grandTotal" },
                      },
                    },
                  ],
                  conversionMetrics: [
                    {
                      $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        averageOrderValue: { $avg: "$grandTotal" },
                        totalRevenue: { $sum: "$grandTotal" },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]),

      // Product metrics (down from 1 query, now optimized with field selection)
      Product.find({ isLowStock: true })
        .select("name totalStock variants")
        .limit(10)
        .lean(),

      // User metrics combined (down from 2 queries → 1)
      User.aggregate([
        {
          $facet: {
            totalCustomers: [
              { $match: { role: "customer" } },
              { $count: "count" },
            ],
            signUpUsers: [
              { $match: { role: "customer" } },
              {
                $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  signups: { $sum: 1 },
                },
              },
              { $sort: { _id: -1 } },
              { $limit: 30 },
            ],
          },
        },
      ]),
    ]);

    // Flatten metrics for easier access
    const {
      totalMetrics: [totalData = {}],
      todayMetrics: [todayData = {}],
      periodMetrics: [periodData = {}],
      previousPeriodMetrics: [previousPeriodData = {}],
      pendingOrders: [pendingData = {}],
      failedPayments: [failedPaymentData = {}],
      salesHistory,
      topProducts: topPerformingProducts,
      growthTrends,
      businessAnalysis: [businessAnalysis = {}],
    } = orderMetrics[0];

    const lowStockProducts = productMetrics;

    const { totalCustomers: [customerData = {}], signUpUsers } = userMetrics[0];

    const totalOrders = totalData.totalOrders || 0;
    const totalSales = totalData.totalSales || 0;
    const todayOrders = todayData.todayOrders || 0;
    const todaySalesResult = todayData.todaySales || 0;
    const periodOrders = periodData.periodOrders || 0;
    const periodSalesResult = [{ _id: null, total: periodData.periodSales || 0 }];
    const previousPeriodOrders = previousPeriodData.previousOrders || 0;
    const previousPeriodSalesResult = [{ _id: null, total: previousPeriodData.previousSales || 0 }];
    const totalCustomers = customerData.count || 0;
    const pendingOrders = pendingData.count || 0;
    const failedPayments = failedPaymentData;

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

    const currentPeriodSales = periodData.periodSales || 0;
    const previousPeriodSales = previousPeriodData.previousSales || 0;

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
      totalSales,
      todaySales: todaySalesResult,
      periodOrders,
      periodSales: currentPeriodSales,
      previousPeriodOrders,
      previousPeriodSales,
      periodOrdersTrend: calculateTrend(periodOrders, previousPeriodOrders),
      periodSalesTrend: calculateTrend(currentPeriodSales, previousPeriodSales),
      totalCustomers,
      totalSignups,
      pendingOrders,
      failedPaymentsCount: failedPayments?.count || 0,
      failedPaymentsAmount: failedPayments?.totalAmount || 0,

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
        productInfo: product.productInfo[0] || null,
      })),

      // Business Analysis
      businessAnalysis: {
        byPaymentMethod: businessAnalysis?.byPaymentMethod || [],
        byStatus: businessAnalysis?.byStatus || [],
        conversionMetrics: businessAnalysis?.conversionMetrics[0] || {
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
