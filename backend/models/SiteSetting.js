import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: 'Daksha Food Artisan' },
    tagline: String,
    logoUrl: String,
    faviconUrl: String,

    email: String,
    phone: String,
    whatsapp: String,
    address: String,

    seoTitle: String,
    seoDescription: String,

    social: {
      instagram: String,
      facebook: String,
      youtube: String,
    },

    invoice: {
      prefix: { type: String, default: 'DFA' },
      footerText: { type: String, default: 'Thank you for shopping with us!' },
      gstNumber: String,
      showGst: { type: Boolean, default: false },
      termsAndConditions: String,
    },

    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },

    notifications: {
      emailEnabled: { type: Boolean, default: false },
      smsEnabled: { type: Boolean, default: false },
      adminEmail: String,
      smsApiKey: String,
    },

    lowStockThreshold: { type: Number, default: 10 },

    aboutUs: String,
    returnPolicy: String,
    privacyPolicy: String,

    shippingBanner: {
      title: { type: String, default: '🚚 Free Global Shipping.' },
      subtitle: { type: String, default: 'Orders above ₹999 enjoy complimentary delivery' },
      threshold: { type: Number, default: 999 },
      enabled: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;
