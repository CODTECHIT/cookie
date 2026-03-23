import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema(
  {
    zoneName: { type: String, required: true },   // "Hyderabad Local"
    pincodes: [{ type: String }],                 // ["500001", "500032"]

    deliveryCharge: { type: Number, default: 50 },
    freeDeliveryAbove: Number,   // free delivery if order > this amount
    estimatedDays: { type: String, default: '2-3 days' },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// For fast pincode lookup at checkout
shippingZoneSchema.index({ pincodes: 1 });

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema);
export default ShippingZone;
