import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: String,           // Cloudinary public_id for deletion
  isMain: { type: Boolean, default: false },
});

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },   // "100g" | "250g" | "500g"
  price: { type: Number, required: true },    // ₹ selling price
  originalPrice: Number,                      // ₹ MRP
  discount: { type: Number, default: 0 },     // percentage
  stockQty: { type: Number, default: 0 },
  sku: String,                                // "CASHEW-COOKIE-250G"
});

const productSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    shortDescription: String,

    images: [imageSchema],
    variants: [variantSchema],

    // Denormalized for fast dashboard low-stock queries
    totalStock: { type: Number, default: 0 },
    isLowStock: { type: Boolean, default: false },
    lowStockThreshold: { type: Number, default: 10 },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // SEO
    metaTitle: String,
    metaDescription: String,

    // Analytics (denormalized)
    totalSold: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    tags: [String],
  },
  { timestamps: true }
);

// Auto-compute totalStock and isLowStock before save
productSchema.pre('save', async function () {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stockQty || 0), 0);
    this.isLowStock = this.totalStock <= this.lowStockThreshold;
  }
});

productSchema.index({ categoryId: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ isLowStock: 1 });
productSchema.index({ totalSold: -1 });

// ⚡ Compound indexes for faster filtering and sorting
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ slug: 1 }); // for URL lookups

const Product = mongoose.model('Product', productSchema);
export default Product;
