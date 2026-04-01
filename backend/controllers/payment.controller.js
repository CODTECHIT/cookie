import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Helper: Fulfill Order ──────────────────────────────────────────────────
const fulfillOrder = async (orderId, paymentDetails) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "Paid") return { order, alreadyPaid: true };

  const payment = await Payment.create({
    orderId: order._id,
    customerId: order.customerId,
    amount: order.grandTotal,
    method: paymentDetails.method || "CARD",
    gatewayName: paymentDetails.gatewayName || "Razorpay",
    gatewayOrderId: paymentDetails.gatewayOrderId,
    gatewayPaymentId: paymentDetails.gatewayPaymentId,
    gatewaySignature: paymentDetails.gatewaySignature,
    status: "Captured",
    paidAt: new Date(),
  });

  order.paymentId = payment._id;
  order.paymentStatus = "Paid";
  order.paymentFailure = undefined;
  await order.save();

  // Update customer metrics only after payment is captured.
  await User.findByIdAndUpdate(order.customerId, {
    $inc: { totalOrders: 1, totalSpent: order.grandTotal },
  });
  const customer = await User.findById(order.customerId);
  if (customer) {
    customer.isRepeatCustomer = customer.totalOrders > 1;
    await customer.save();
  }

  // Increment coupon usage only after successful payment.
  if (order.couponId) {
    const Coupon = (await import("../models/Coupon.js")).default;
    await Coupon.findByIdAndUpdate(order.couponId, { $inc: { usedCount: 1 } });
  }

  // 📈 Business Intelligence: Update Product Stats & Inventory
  const updateTasks = order.items.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (product) {
      product.totalSold = (product.totalSold || 0) + (item.quantity || 1);
      const variantEntry = product.variants.find(
        (v) => v.weight === item.variant?.weight,
      );
      if (variantEntry) {
        variantEntry.stockQty = Math.max(
          0,
          variantEntry.stockQty - (item.quantity || 1),
        );
      }
      await product.save();
    }
  });
  await Promise.all(updateTasks);

  return { order, payment };
};

// GET /api/payments  (admin)
export const getAllPayments = async (req, res) => {
  try {
    const { status, method, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (search) {
      filter.$or = [
        { gatewayPaymentId: { $regex: search, $options: "i" } },
        { gatewayOrderId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("orderId", "orderNumber grandTotal")
        .populate("customerId", "name phone")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Payment.countDocuments(filter),
    ]);
    successResponse(res, {
      payments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/payments/export-csv  (admin)
export const exportPaymentsCSV = async (req, res) => {
  try {
    const { status, method, from, to } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (method) filter.method = method;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const payments = await Payment.find(filter)
      .populate("orderId", "orderNumber")
      .populate("customerId", "name phone")
      .sort({ createdAt: -1 });

    const headers = [
      "TransactionId",
      "OrderNumber",
      "Customer",
      "Method",
      "Status",
      "Amount",
      "Currency",
      "Gateway",
      "CreatedAt",
    ];

    const escape = (value) => {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `\"${str.replace(/\"/g, '\"\"')}\"`;
      }
      return str;
    };

    const rows = payments.map((p) => [
      p.gatewayPaymentId || p._id,
      p.orderId?.orderNumber || "",
      p.customerId?.name || "",
      p.method || "",
      p.status || "",
      p.amount ?? 0,
      p.currency || "INR",
      p.gatewayName || "",
      p.createdAt ? p.createdAt.toISOString() : "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map(escape).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payments-report-${new Date().toISOString().split("T")[0]}.csv`,
    );
    return res.status(200).send(csv);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/payments/razorpay-order — Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes } = req.body;

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt,
      notes: notes || {}, // Include local order ID if provided
    };

    const order = await razorpay.orders.create(options);
    successResponse(res, order);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/payments/verify — Verify Razorpay Payment
// IMPROVED: Better error handling and validation
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId, // local order id
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      method,
    } = req.body;

    // Validate required fields
    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return errorResponse(res, "Missing required payment fields", 400);
    }

    console.log(
      `🔍 Verifying payment: Order=${orderId}, PaymentId=${razorpay_payment_id}`,
    );

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn(`⚠️ Signature mismatch for payment ${razorpay_payment_id}`);
      return errorResponse(res, "Payment signature verification failed", 401);
    }

    console.log(`✅ Signature verified for payment ${razorpay_payment_id}`);

    // Fulfill the order
    const { order, payment, alreadyPaid } = await fulfillOrder(orderId, {
      method: method || "CARD",
      gatewayOrderId: razorpay_order_id,
      gatewayPaymentId: razorpay_payment_id,
      gatewaySignature: razorpay_signature,
    });

    console.log(`🎉 Order fulfilled: ${order.orderNumber}`);
    successResponse(
      res,
      { order, payment },
      alreadyPaid ? "Order already processed" : "Payment verified successfully",
    );
  } catch (err) {
    console.error(`❌ Payment verification error:`, err);
    errorResponse(res, err.message || "Payment verification failed", 500);
  }
};

// POST /api/payments/mark-failed — Persist gateway decline reason against local order
export const markPaymentFailed = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return errorResponse(res, "orderId is required", 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    if (order.paymentStatus === "Paid") {
      return successResponse(
        res,
        { orderId: order._id, paymentStatus: order.paymentStatus },
        "Order already paid; failure callback ignored",
      );
    }

    order.paymentStatus = "Failed";
    order.paymentFailure = {
      code: error?.code || "PAYMENT_FAILED",
      description: error?.description || "Payment declined",
      reason: error?.reason || "unknown",
      source: error?.source || "gateway",
      step: error?.step || "payment_initiation",
      occurredAt: new Date(),
    };
    order.statusHistory.push({
      status: order.status,
      note: `Payment failed: ${order.paymentFailure.code} - ${order.paymentFailure.reason}`,
    });

    await order.save();

    return successResponse(
      res,
      { orderId: order._id, paymentStatus: order.paymentStatus },
      "Payment failure recorded",
    );
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to mark payment status",
      500,
    );
  }
};

// POST /api/payments/webhook — Razorpay Webhook
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    // Verify webhook signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.warn("⚠️ Webhook blocked: Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    console.log(`🔔 Razorpay Webhook Received: ${event}`);

    // Capture fallback: if frontend missed verification
    if (event === "payment.captured" || event === "order.paid") {
      const localOrderId = payload.notes?.order_id;

      if (localOrderId) {
        console.log(`📦 Webhook fulfilling order: ${localOrderId}`);
        await fulfillOrder(localOrderId, {
          method: payload.method?.toUpperCase() || "CARD",
          gatewayOrderId: payload.order_id,
          gatewayPaymentId: payload.id,
          gatewaySignature: "WEBHOOK_VERIFIED",
        });
      } else {
        console.warn("❓ Webhook Warning: No order_id found in payload notes");
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// GET /api/payments/report (Admin)
export const getPaymentReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);

    const match = {};
    if (from || to) match.createdAt = dateFilter;

    const report = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$method",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    successResponse(res, report);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
