import Order from "../models/Order.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/orders  (admin) — Show Paid and Failed payments by default
export const getAllOrders = async (req, res) => {
  try {
    const {
      status,
      paymentMethod,
      paymentStatus,
      page = 1,
      limit = 20,
      search,
      showAll = false,
    } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Default: show Paid and Failed payments. If showAll=true, show all
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    } else if (showAll !== "true") {
      filter.paymentStatus = { $in: ["Paid", "Failed"] };
    }

    if (search) filter.orderNumber = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customerId", "name phone email")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);
    successResponse(res, {
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/orders/:id  (admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "customerId paymentId",
    );
    if (!order) return errorResponse(res, "Order not found", 404);
    successResponse(res, order);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/orders  (customer places order)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      couponCode,
      paymentMethod,
      customerSnapshot,
      deliveryCharge: clientDeliveryCharge,
    } = req.body;
    const customerId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    // ⚡ SECURITY FIX: Recalculate everything on backend
    const Product = (await import("../models/Product.js")).default;
    let subTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return errorResponse(res, `Product ${item.productName} is unavailable`, 400);
      }

      const variant = product.variants.find(v => v.weight === item.variant?.weight);
      if (!variant) {
        return errorResponse(res, `Invalid variant for ${product.name}`, 400);
      }

      const itemTotal = variant.price * item.quantity;
      subTotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        image: product.images?.[0]?.url || item.image,
        variant: { weight: variant.weight, sku: variant.sku },
        quantity: item.quantity,
        unitPrice: variant.price,
        totalPrice: itemTotal,
      });
    }

    // Validate Coupon if provided
    let discount = 0;
    let couponId = null;
    if (couponCode) {
      const { validateCouponInternal } = await import("./coupon.controller.js");
      const couponRes = await validateCouponInternal(couponCode, subTotal, customerId);
      if (couponRes.success) {
        discount = couponRes.data.discountAmount;
        couponId = couponRes.data.couponId;
      } else {
        return errorResponse(res, couponRes.message, 400);
      }
    }

    // Recalculate shipping based on site settings
    const SiteSetting = (await import("../models/SiteSetting.js")).default;
    const settings = await SiteSetting.findOne();
    const threshold = settings?.shippingBanner?.threshold || 999;
    const deliveryCharge = subTotal >= threshold ? 0 : (clientDeliveryCharge || 0);

    const grandTotal = Math.max(0, subTotal + deliveryCharge - discount);

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerId,
      items: validatedItems,
      subTotal,
      deliveryCharge,
      discount,
      couponCode,
      couponId,
      grandTotal,
      paymentMethod,
      customerSnapshot,
      statusHistory: [{ status: "Pending", note: "Order placed" }],
    });

    successResponse(res, order, "Order created", 201);
  } catch (err) {
    console.error("❌ Order Creation Error:", err);
    errorResponse(res, err.message);
  }
};

// PATCH /api/orders/:id/status  (admin — change order status)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, "Order not found", 404);

    order.status = status;
    order.statusHistory.push({ status, changedBy: req.user._id, note });
    if (status === "Delivered") order.deliveredAt = new Date();

    await order.save();
    successResponse(res, order, `Order status updated to ${status}`);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PATCH /api/orders/:id/tracking  (admin — add tracking info)
export const updateTracking = async (req, res) => {
  try {
    const { shippingCarrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;
    
    // 🚚 Automatically advance status to Shipped when tracking is added
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, "Order not found", 404);

    order.shippingCarrier = shippingCarrier;
    order.trackingNumber = trackingNumber;
    order.trackingUrl = trackingUrl;
    order.estimatedDelivery = estimatedDelivery;

    // Only auto-advance if not already Shipped/Delivered
    if (!["Shipped", "Delivered"].includes(order.status)) {
      order.status = "Shipped";
      order.statusHistory.push({ 
        status: "Shipped", 
        changedBy: req.user._id, 
        note: `Tracking information added: ${shippingCarrier} #${trackingNumber}` 
      });
    }

    await order.save();
    
    successResponse(res, order, "Tracking information updated and order marked as Shipped");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/orders/my-orders  (customer orders)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      customerId: req.user._id,
      paymentStatus: { $in: ["Paid", "Failed"] } 
    }).sort({
      createdAt: -1,
    });
    successResponse(res, orders);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
