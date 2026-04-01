import express from "express";
import {
  getAllPayments,
  createRazorpayOrder,
  verifyPayment,
  markPaymentFailed,
  razorpayWebhook,
  getPaymentReport,
  exportPaymentsCSV,
} from "../controllers/payment.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllPayments);
router.get("/report", protect, adminOnly, getPaymentReport);
router.get("/export-csv", protect, adminOnly, exportPaymentsCSV);
router.post("/razorpay-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);
router.post("/mark-failed", protect, markPaymentFailed);
router.post("/webhook", razorpayWebhook); // Use raw express if needed for verification

export default router;
