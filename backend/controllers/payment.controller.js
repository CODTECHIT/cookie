import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// GET /api/payments  (admin)
export const getAllPayments = async (req, res) => {
  try {
    const { isCOD, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isCOD !== undefined) filter.isCOD = isCOD === 'true';
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find(filter).populate('orderId', 'orderNumber grandTotal').populate('customerId', 'name phone').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Payment.countDocuments(filter),
    ]);
    successResponse(res, { payments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/payments/razorpay-order — Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    successResponse(res, order);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/payments/verify — Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { 
      orderId, // local order id
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return errorResponse(res, 'Invalid payment signature', 400);
    }

    // Payment is valid, update local records
    const order = await Order.findById(orderId);
    if (!order) return errorResponse(res, 'Order not found', 404);

    const payment = await Payment.create({
      orderId,
      customerId: order.customerId,
      amount: order.grandTotal,
      method: 'CARD', // Could be dynamic but simplified for now
      gatewayName: 'Razorpay',
      gatewayOrderId: razorpay_order_id,
      gatewayPaymentId: razorpay_payment_id,
      gatewaySignature: razorpay_signature,
      status: 'Captured',
      paidAt: new Date(),
      isCOD: false,
    });

    order.paymentId = payment._id;
    order.paymentStatus = 'Paid';
    await order.save();

    // 📈 Business Intelligence: Update Product Stats & Inventory
    const updateTasks = order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
            // 1. Increment total sold
            product.totalSold = (product.totalSold || 0) + (item.quantity || 1);
            
            // 2. Decrement physical stock in variant
            const variantEntry = product.variants.find(v => v.weight === item.variant?.weight);
            if (variantEntry) {
                variantEntry.stockQty = Math.max(0, variantEntry.stockQty - (item.quantity || 1));
            }

            // Note: product.pre('save') will auto-update totalStock and isLowStock
            await product.save();
        }
    });
    await Promise.all(updateTasks);

    successResponse(res, { order, payment }, 'Payment verified successfully');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/payments/webhook — Razorpay Webhook
export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      return res.status(400).send('Invalid signature');
    }

    // Process event: payment.captured
    const event = req.body.event;
    if (event === 'payment.captured') {
        const payload = req.body.payload.payment.entity;
        console.log('Webhook: Payment captured for Order:', payload.notes?.order_id || payload.order_id);
        // logic to update order if verifyPayment was missed
    }

    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Internal Server Error');
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
          _id: '$method',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
    successResponse(res, report);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
