import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: String,

    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },

    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: Number,   // cap for percentage discounts

    usageLimit: Number,          // null = unlimited
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },

    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },

    tag: String,    // "Diwali" | "Holi" | "Republic Day"
  },
  { timestamps: true }
);

couponSchema.index({ isActive: 1, validUntil: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
