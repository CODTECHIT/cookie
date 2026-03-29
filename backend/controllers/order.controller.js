import Order from '../models/Order.js';
import User from '../models/User.js';
import { generateOrderNumber } from '../utils/generateOrderNumber.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// GET /api/orders  (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentMethod, paymentStatus, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('customerId', 'name phone email').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);
    successResponse(res, { orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/orders/:id  (admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId paymentId');
    if (!order) return errorResponse(res, 'Order not found', 404);
    successResponse(res, order);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/orders  (customer places order)
export const createOrder = async (req, res) => {
  try {
    const { customerId, items, subTotal, deliveryCharge, discount, couponCode, couponId, grandTotal, paymentMethod, customerSnapshot } = req.body;

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber, customerId, items, subTotal, deliveryCharge,
      discount, couponCode, couponId, grandTotal, paymentMethod, customerSnapshot,
      statusHistory: [{ status: 'Pending', note: 'Order placed' }],
    });

    // Update customer metrics
    await User.findByIdAndUpdate(customerId, {
      $inc: { totalOrders: 1, totalSpent: grandTotal },
    });
    const customer = await User.findById(customerId);
    if (customer) {
      customer.isRepeatCustomer = customer.totalOrders > 1;
      await customer.save();
    }

    if (couponId) {
      const Coupon = (await import('../models/Coupon.js')).default;
      await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
    }

    successResponse(res, order, 'Order created', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PATCH /api/orders/:id/status  (admin — change order status)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return errorResponse(res, 'Order not found', 404);

    order.status = status;
    order.statusHistory.push({ status, changedBy: req.user._id, note });
    if (status === 'Delivered') order.deliveredAt = new Date();

    await order.save();
    successResponse(res, order, 'Order status updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// PATCH /api/orders/:id/tracking  (admin — add tracking info)
export const updateTracking = async (req, res) => {
  try {
    const { shippingCarrier, trackingNumber, trackingUrl, estimatedDelivery } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { shippingCarrier, trackingNumber, trackingUrl, estimatedDelivery },
      { new: true }
    );
    successResponse(res, order, 'Tracking updated');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/orders/my-orders  (customer orders)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    successResponse(res, orders);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
