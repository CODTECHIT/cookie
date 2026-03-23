import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    imageUrl: { type: String, required: true },
    imagePublicId: String,

    linkUrl: String,
    linkType: { type: String, enum: ['category', 'product', 'external', 'none'], default: 'none' },
    linkTarget: mongoose.Schema.Types.ObjectId,   // categoryId or productId

    position: { type: String, enum: ['hero', 'middle', 'bottom'], default: 'hero' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // Schedule banners in advance
    showFrom: Date,
    showUntil: Date,
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
