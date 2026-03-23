import mongoose from 'mongoose';

const reportCacheSchema = new mongoose.Schema({
  date: { type: Date, required: true },        // start of day UTC
  type: { type: String, enum: ['daily', 'monthly'], default: 'daily' },

  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalItemsSold: { type: Number, default: 0 },

  onlineRevenue: { type: Number, default: 0 },
  codRevenue: { type: Number, default: 0 },

  topProducts: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      unitsSold: Number,
      revenue: Number,
    },
  ],

  newCustomers: { type: Number, default: 0 },
  returningCustomers: { type: Number, default: 0 },

  estimatedCost: { type: Number, default: 0 },
  estimatedProfit: { type: Number, default: 0 },

  generatedAt: { type: Date, default: Date.now },
});

reportCacheSchema.index({ date: -1, type: 1 });

const ReportCache = mongoose.model('ReportCache', reportCacheSchema);
export default ReportCache;
