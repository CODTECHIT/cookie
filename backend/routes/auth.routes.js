import express from 'express';
import { login, getMe, registerAdmin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register-admin', registerAdmin);  // one-time setup
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
