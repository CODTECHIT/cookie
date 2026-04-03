import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { sendEmail } from "../utils/email.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/login — Admin login
export const login = async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const password = req.body?.password;
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !password)
      return errorResponse(res, "Email and password are required", 400);

    const user = await User.findOne({ email, role: "admin" }).select(
      "+passwordHash",
    );
    if (!user || !(await user.comparePassword(password)))
      return errorResponse(res, "Invalid email or password", 401);

    if (!user.isActive)
      return errorResponse(res, "Account is deactivated", 403);

    user.lastLoginAt = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/auth/me — Get current admin
export const getMe = async (req, res) => {
  successResponse(res, req.user, "Current user");
};

// POST /api/auth/register — Customer registration
export const register = async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const phone = req.body?.phone?.trim();
    const password = req.body?.password;

    if (!name || !(email || phone) || !password) {
      return errorResponse(
        res,
        "Name, email or phone, and password are required",
        400,
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists)
      return errorResponse(
        res,
        "User with this email or phone already exists",
        400,
      );

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
      role: "customer",
    });
    const token = signToken(user._id);

    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Account created",
      201,
    );
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/auth/customer-login — Customer login
export const customerLogin = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const phone = req.body?.phone?.trim();
    const password = req.body?.password;
    if (!(email || phone) || !password)
      return errorResponse(res, "Credentials and password are required", 400);

    const query = email ? { email } : { phone };
    const user = await User.findOne({ ...query, role: "customer" }).select(
      "+passwordHash",
    );

    if (!user || !(await user.comparePassword(password)))
      return errorResponse(res, "Invalid credentials", 401);

    if (!user.isActive)
      return errorResponse(res, "Account is deactivated", 403);

    user.lastLoginAt = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/auth/register-admin — Create first admin (one-time setup)
export const registerAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists)
      return errorResponse(res, "Admin already exists. Use login.", 400);

    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!name || !email || !password) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    const admin = await User.create({
      name,
      email,
      passwordHash: password,
      role: "admin",
    });
    const token = signToken(admin._id);
    successResponse(res, { token }, "Admin registered", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email: rawEmail } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    if (!email) return errorResponse(res, "Email is required", 400);

    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, "If an account exists with this email, you will receive an OTP", 200);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to user (valid for 10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // ⚡ REAL EMAIL SENDER ACTIVATED!
    try {
      await sendEmail({
        email: user.email,
        subject: "[Daksha Food Artisan] Secure Password Reset Request",
        otp
      });
    } catch (emailErr) {
      console.error("❌ Email Error:", emailErr.message);
      // Fallback for developers if EMAIL_USER/PASS are not set yet
      console.log(`🔐 BACKUP OTP for ${email}: ${otp}`);
    }

    successResponse(res, null, "OTP sent to your email address (valid for 10 mins)");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email: rawEmail, otp, password: newPassword } = req.body;
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !otp || !newPassword) 
      return errorResponse(res, "Email, OTP and New Password are required", 400);

    const user = await User.findOne({ 
      email, 
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordOTP +resetPasswordExpires");

    if (!user) return errorResponse(res, "Invalid or expired OTP", 400);

    // Update password and clear OTP
    user.passwordHash = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    successResponse(res, null, "Password reset successful! You can now login.");
  } catch (err) {
    errorResponse(res, err.message);
  }
};
