import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import PDFDocument from "pdfkit";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// Helper: Convert data to CSV
const convertToCSV = (data, headers) => {
  const csv = [headers.join(",")];
  data.forEach((row) => {
    csv.push(
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma or newline
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes("\n") || value.includes('"'))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    );
  });
  return csv.join("\n");
};

// GET /api/reports/sales  (daily or monthly)
export const getSalesReport = async (req, res) => {
  try {
    const { period = "daily", from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const groupId =
      period === "monthly"
        ? { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }
        : {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          };

    const report = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          ...(from || to ? { createdAt: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$grandTotal" },
          avgOrderValue: { $avg: "$grandTotal" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
    ]);

    // Determine selected period window for signup analytics.
    let periodStart;
    let periodEnd;

    if (from || to) {
      periodStart = from ? new Date(from) : new Date(0);
      periodEnd = to ? new Date(to) : new Date();
      periodStart.setHours(0, 0, 0, 0);
      periodEnd.setHours(23, 59, 59, 999);
    } else if (period === "monthly") {
      periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodStart = new Date();
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodEnd.getDate() + 1);
    }

    const newCustomers = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: periodStart, $lt: periodEnd },
    });

    const reportWithSignups =
      report.length > 0
        ? report.map((item) => ({ ...item, newCustomers }))
        : [
            {
              _id: null,
              totalOrders: 0,
              totalRevenue: 0,
              avgOrderValue: 0,
              newCustomers,
            },
          ];

    successResponse(res, reportWithSignups);
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
      .select("name images totalSold avgRating variants categoryId")
      .populate("categoryId", "name");
    successResponse(res, products);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/export/sales-csv
export const exportSalesReportCSV = async (req, res) => {
  try {
    const { from, to } = req.query;

    const dateFilter = { paymentStatus: "Paid" };
    if (from)
      dateFilter.createdAt = { ...dateFilter.createdAt, $gte: new Date(from) };
    if (to)
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(to) };

    const orders = await Order.find(dateFilter)
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    const csvData = orders.map((order) => ({
      "Order Number": order.orderNumber,
      Date: new Date(order.createdAt).toISOString().split("T")[0],
      "Customer Name": order.customerSnapshot?.name || "N/A",
      "Customer Email": order.customerSnapshot?.email || "N/A",
      Phone: order.customerSnapshot?.phone || "N/A",
      "Total Amount": order.grandTotal,
      "Payment Method": order.paymentMethod,
      Status: order.status,
      "Items Count": order.items.length,
    }));

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Customer Email",
      "Phone",
      "Total Amount",
      "Payment Method",
      "Status",
      "Items Count",
    ];
    const csv = convertToCSV(csvData, headers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.csv",
    );
    res.send(csv);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/export/customers-csv
export const exportCustomersReportCSV = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).sort({
      createdAt: -1,
    });

    // Get paid orders for each customer
    const csvData = await Promise.all(
      customers.map(async (customer) => {
        const paidOrders = await Order.find({
          customerId: customer._id,
          paymentStatus: "Paid",
        });
        const totalSpent = paidOrders.reduce(
          (sum, order) => sum + order.grandTotal,
          0,
        );

        return {
          "Customer Name": customer.name,
          Email: customer.email || "N/A",
          Phone: customer.phone || "N/A",
          "Total Orders": customer.totalOrders,
          "Total Spent": totalSpent,
          "Joined Date": new Date(customer.createdAt)
            .toISOString()
            .split("T")[0],
          "Repeat Customer": customer.isRepeatCustomer ? "Yes" : "No",
        };
      }),
    );

    const headers = [
      "Customer Name",
      "Email",
      "Phone",
      "Total Orders",
      "Total Spent",
      "Joined Date",
      "Repeat Customer",
    ];
    const csv = convertToCSV(csvData, headers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=customers-report.csv",
    );
    res.send(csv);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/export/products-csv
export const exportProductsReportCSV = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ totalSold: -1 });

    const csvData = products.map((product) => ({
      "Product Name": product.name,
      Category: product.categoryId?.name || "N/A",
      Price: product.price,
      Stock: product.totalStock,
      "Total Sold": product.totalSold,
      Rating: product.avgRating || 0,
      Active: product.isActive ? "Yes" : "No",
      "Created Date": new Date(product.createdAt).toISOString().split("T")[0],
    }));

    const headers = [
      "Product Name",
      "Category",
      "Price",
      "Stock",
      "Total Sold",
      "Rating",
      "Active",
      "Created Date",
    ];
    const csv = convertToCSV(csvData, headers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products-report.csv",
    );
    res.send(csv);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/export/orders-csv
export const exportOrdersReportCSV = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    const csvData = orders.map((order) => ({
      "Order Number": order.orderNumber,
      "Customer Name": order.customerSnapshot?.name || "N/A",
      "Total Amount": order.grandTotal,
      "Payment Status": order.paymentStatus,
      "Order Status": order.status,
      "Payment Method": order.paymentMethod,
      Items: order.items.length,
      Date: new Date(order.createdAt).toISOString().split("T")[0],
    }));

    const headers = [
      "Order Number",
      "Customer Name",
      "Total Amount",
      "Payment Status",
      "Order Status",
      "Payment Method",
      "Items",
      "Date",
    ];
    const csv = convertToCSV(csvData, headers);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders-report.csv",
    );
    res.send(csv);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/reports/export/bi-pdf
export const exportBusinessIntelligencePDF = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    const periodStart = new Date();
    periodStart.setHours(0, 0, 0, 0);
    if (period === "monthly") {
      periodStart.setDate(1);
    }

    const periodEnd = new Date(periodStart);
    if (period === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setDate(periodEnd.getDate() + 1);
    }

    const [salesAgg, ordersCount, newCustomers, topProducts] =
      await Promise.all([
        Order.aggregate([
          {
            $match: {
              paymentStatus: "Paid",
              createdAt: { $gte: periodStart, $lt: periodEnd },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$grandTotal" },
              avgOrderValue: { $avg: "$grandTotal" },
            },
          },
        ]),
        Order.countDocuments({
          paymentStatus: "Paid",
          createdAt: { $gte: periodStart, $lt: periodEnd },
        }),
        User.countDocuments({
          role: "customer",
          createdAt: { $gte: periodStart, $lt: periodEnd },
        }),
        Product.find({ isActive: true })
          .sort({ totalSold: -1 })
          .limit(10)
          .select("name totalSold"),
      ]);

    const totalRevenue = salesAgg[0]?.totalRevenue || 0;
    const avgOrderValue = salesAgg[0]?.avgOrderValue || 0;

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const fileName = `business-intelligence-${period}-${new Date().toISOString().split("T")[0]}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    doc.pipe(res);

    doc.fontSize(22).text("Business Intelligence Report", { align: "left" });
    doc.moveDown(0.4);
    doc
      .fontSize(11)
      .fillColor("#666")
      .text(`Period: ${period === "monthly" ? "Monthly" : "Daily"}`)
      .text(`Generated: ${new Date().toLocaleString("en-IN")}`)
      .text(
        `Range: ${periodStart.toLocaleDateString("en-IN")} - ${new Date(periodEnd.getTime() - 1).toLocaleDateString("en-IN")}`,
      );

    doc.moveDown(1.2);
    doc.fillColor("#000").fontSize(14).text("Summary");
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Total Revenue: INR ${totalRevenue.toLocaleString("en-IN")}`);
    doc.fontSize(12).text(`Paid Orders: ${ordersCount}`);
    doc
      .fontSize(12)
      .text(`Average Order Value: INR ${avgOrderValue.toFixed(2)}`);
    doc.fontSize(12).text(`New Signups: ${newCustomers}`);

    doc.moveDown(1.2);
    doc.fillColor("#000").fontSize(14).text("Top Performing Inventory");
    doc.moveDown(0.6);

    if (topProducts.length === 0) {
      doc.fontSize(11).fillColor("#666").text("No product data available.");
    } else {
      topProducts.forEach((item, index) => {
        doc
          .fillColor("#000")
          .fontSize(11)
          .text(
            `${index + 1}. ${item.name}  -  Units Sold: ${item.totalSold || 0}`,
          );
      });
    }

    doc.end();
  } catch (err) {
    return errorResponse(res, err.message);
  }
};
