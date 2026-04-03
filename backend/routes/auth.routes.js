import express from 'express';
import { 
  login, getMe, registerAdmin, register, customerLogin,
  forgotPassword, resetPassword 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register-admin', registerAdmin);  // one-time setup
router.post('/login', login);
router.post('/register', register);
router.post('/customer-login', customerLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

export default router;
