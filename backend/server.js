import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import contentRoutes from "./routes/content.routes.js";
import reportRoutes from "./routes/report.routes.js";
import seedAdmin from "./utils/seedAdmin.js";
import seedCategories from "./utils/seedCategories.js";

// Connect to MongoDB & Seed Admin
await connectDB();
await seedAdmin();
await seedCategories();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // For easier local development with external scripts
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
  }),
);

// ✅ CORS MUST come BEFORE setting custom headers
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or allow everything during development
      if (!origin || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        const allowedOrigins = [
          process.env.CLIENT_URL,
          "http://localhost:5173",
          "http://localhost:5174",
        ];
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(null, true); // Still allowing for dynamic tunnels
        }
      }
    },
    credentials: true,
    // ✅ CRITICAL: Expose custom headers - including Razorpay headers
    exposedHeaders: [
      "request-id",
      "x-rtb-fingerprint-id",
      "content-type",
      "access-control-allow-origin",
      "access-control-allow-credentials",
    ],
  }),
);

// ✅ Set custom headers AFTER CORS middleware
app.use((req, res, next) => {
  // Generate and set request ID
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("request-id", requestId);

  // Set Permissions-Policy (restrict unnecessary sensors, allow payment)
  res.setHeader(
    "Permissions-Policy",
    "accelerometer=*, camera=(), geolocation=(), gyroscope=*, magnetometer=(), microphone=(), payment=*, usb=()",
  );

  // Log for debugging
  req.id = requestId;
  console.log(`[${requestId}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/reports", reportRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Daksha Food Artisan API is healthy 🍪",
    timestamp: new Date(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
