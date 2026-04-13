import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET", "EMI", "PAYLATER", "ONLINE"],
      required: true,
    },

    // Online payment gateway fields (Razorpay / PhonePe)
    gatewayName: String,
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewaySignature: String,

    status: {
      type: String,
      enum: ["Captured", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },

    paidAt: Date,
  },
  { timestamps: true },
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ customerId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paidAt: -1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ gatewayPaymentId: 1 });
paymentSchema.index({ gatewayOrderId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
