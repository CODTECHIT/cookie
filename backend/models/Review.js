import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },

    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    images: [String],

    // Admin moderation
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date,

    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ customerId: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
