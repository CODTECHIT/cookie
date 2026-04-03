import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  street: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },

    addresses: [addressSchema],
    resetPasswordOTP: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Customer metrics (denormalized for fast dashboard)
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    isRepeatCustomer: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Auto-update isRepeatCustomer
userSchema.methods.incrementOrder = async function (amount) {
  this.totalOrders += 1;
  this.totalSpent += amount;
  this.isRepeatCustomer = this.totalOrders > 1;
  await this.save();
};

userSchema.index({ role: 1 });
userSchema.index({ isRepeatCustomer: 1 });

const User = mongoose.model('User', userSchema);
export default User;
