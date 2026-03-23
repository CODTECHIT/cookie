import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

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

// POST /api/payments  (created internally after order)
export const createPayment = async (req, res) => {
  try {
    const { orderId, customerId, amount, method, gatewayName, gatewayOrderId, gatewayPaymentId, gatewaySignature } = req.body;

    const isCOD = method === 'COD';
    const payment = await Payment.create({
      orderId, customerId, amount, method,
      isCOD, status: isCOD ? 'Pending' : 'Captured',
      paidAt: isCOD ? null : new Date(),
      gatewayName, gatewayOrderId, gatewayPaymentId, gatewaySignature,
    });

    // Link payment to order and update paymentStatus
    await Order.findByIdAndUpdate(orderId, {
      paymentId: payment._id,
      paymentStatus: isCOD ? 'Pending' : 'Paid',
    });

    successResponse(res, payment, 'Payment recorded', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/payments/report  (admin payment summary)
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
