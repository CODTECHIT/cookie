import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['UPI', 'CARD', 'NETBANKING', 'COD'], required: true },

    // Online payment gateway fields (Razorpay / PhonePe)
    gatewayName: String,
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewaySignature: String,

    status: {
      type: String,
      enum: ['Captured', 'Pending', 'Failed', 'Refunded'],
      default: 'Pending',
    },

    // COD
    isCOD: { type: Boolean, default: false },
    codCollectedAt: Date,

    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ isCOD: 1 });
paymentSchema.index({ paidAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
