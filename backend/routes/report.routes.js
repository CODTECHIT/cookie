import express from "express";
import {
  getSalesReport,
  getBestSellers,
  exportSalesReportCSV,
  exportCustomersReportCSV,
  exportProductsReportCSV,
  exportOrdersReportCSV,
  exportBusinessIntelligencePDF,
} from "../controllers/report.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/sales", protect, adminOnly, getSalesReport);
router.get("/best-sellers", protect, adminOnly, getBestSellers);

// Export endpoints
router.get("/export/sales-csv", protect, adminOnly, exportSalesReportCSV);
router.get(
  "/export/customers-csv",
  protect,
  adminOnly,
  exportCustomersReportCSV,
);
router.get("/export/products-csv", protect, adminOnly, exportProductsReportCSV);
router.get("/export/orders-csv", protect, adminOnly, exportOrdersReportCSV);
router.get("/export/bi-pdf", protect, adminOnly, exportBusinessIntelligencePDF);

export default router;
