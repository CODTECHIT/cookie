import express from 'express';
import { 
  login, getMe, registerAdmin, register, customerLogin,
  forgotPassword, resetPassword 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';

const router = express.Router();

router.post('/register-admin', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], registerAdmin);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], login);

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
  body('phone').optional({ checkFalsy: true }).isLength({ min: 10 }).withMessage('Valid phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], register);

router.post('/customer-login', [
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
  body('phone').optional({ checkFalsy: true }).notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], customerLogin);

router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  validate
], forgotPassword);

router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP is required'),
  body('password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
], resetPassword);

router.get('/me', protect, getMe);

export default router;
