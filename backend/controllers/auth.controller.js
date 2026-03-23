import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login — Admin login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return errorResponse(res, 'Email and password are required', 400);

    const user = await User.findOne({ email, role: 'admin' }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password)))
      return errorResponse(res, 'Invalid email or password', 401);

    if (!user.isActive)
      return errorResponse(res, 'Account is deactivated', 403);

    user.lastLoginAt = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    successResponse(res, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful');
  } catch (err) {
    errorResponse(res, err.message);
  }
};

// GET /api/auth/me — Get current admin
export const getMe = async (req, res) => {
  successResponse(res, req.user, 'Current user');
};

// POST /api/auth/register-admin — Create first admin (one-time setup)
export const registerAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists)
      return errorResponse(res, 'Admin already exists. Use login.', 400);

    const { name, email, password } = req.body;
    const admin = await User.create({ name, email, passwordHash: password, role: 'admin' });
    const token = signToken(admin._id);
    successResponse(res, { token }, 'Admin registered', 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};
