import User from "../models/User.js";
import Order from "../models/Order.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/customers  (admin)
export const getCustomers = async (req, res) => {
  try {
    const { repeat, page = 1, limit = 20, search } = req.query;
    const filter = { role: "customer" };
    if (repeat === "true") filter.isRepeatCustomer = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (page - 1) * limit;
    const customers = await User.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);

    // Calculate total spend from paid orders only for each customer
    const customersWithSpend = await Promise.all(
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
          ...customer.toObject(),
          totalSpent,
          paidOrdersCount: paidOrders.length,
        };
      }),
    );

    successResponse(res, {
      customers: customersWithSpend,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/customers/:id  (admin — with order history)
export const getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return errorResponse(res, "Customer not found", 404);

    const orders = await Order.find({ customerId: req.params.id })
      .sort({ createdAt: -1 })
      .select("orderNumber grandTotal status createdAt paymentStatus");

    // Calculate total spend from paid orders only
    const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
    const totalPaidSpend = paidOrders.reduce(
      (sum, order) => sum + order.grandTotal,
      0,
    );

    const customerWithMetrics = {
      ...customer.toObject(),
      totalSpent: totalPaidSpend,
      paidOrdersCount: paidOrders.length,
    };

    successResponse(res, {
      customer: customerWithMetrics,
      orders,
      totalPaidSpend,
      paidOrdersCount: paidOrders.length,
    });
  } catch (err) {
    errorResponse(res, err.message);
  }
};
