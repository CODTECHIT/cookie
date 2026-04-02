import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String, // snapshot
  image: String, // snapshot
  variant: {
    weight: String,
    sku: String,
  },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true }, // "DFA-2024-00045"

    // Customer
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerSnapshot: {
      name: String,
      phone: String,
      email: String,
      address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
      },
    },

    items: [orderItemSchema],

    // Pricing
    subTotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: String,
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    grandTotal: { type: Number, required: true },

    // Payment
    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET", "EMI", "PAYLATER", "ONLINE"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentFailure: {
      code: String,
      description: String,
      reason: String,
      source: String,
      step: String,
      occurredAt: Date,
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },

    // Order Status
    status: {
      type: String,
      enum: ["Pending", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: [statusHistorySchema],

    // Shipping
    shippingCarrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    deliveredAt: Date,

    // Invoice
    invoiceUrl: String,

    notes: String,
  },
  { timestamps: true },
);

// Indexes for fast dashboard & filter queries
orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ paymentMethod: 1 });
orderSchema.index({ createdAt: -1 });

// ⚡ Compound indexes for dashboard queries (major speed improvement)
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, paymentMethod: 1 });
orderSchema.index({ "items.productId": 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
