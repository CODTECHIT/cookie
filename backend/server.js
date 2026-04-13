import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import compression from "compression";
import mongoSanitize from "mongo-sanitize";
import hpp from "hpp";
import logger from "./utils/logger.js";

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
import siteRoutes from "./routes/site.routes.js";
import seedAdmin from "./utils/seedAdmin.js";
import seedCategories from "./utils/seedCategories.js";

// Connect to MongoDB & Seed Admin
await connectDB();
await seedAdmin();
await seedCategories();

const app = express();
app.set("trust proxy", 1); // Trust first proxy (Vercel/CDN) to fix rate-limit IP discovery
const PORT = process.env.PORT || 5000;

// ─── Security Global Middleware ───────────────────────────────────────────────

// 1. Helmet for secure headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'", "https://api.razorpay.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for cross-origin images (Cloudinary)
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// 2. Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

// 3. Auth Specific Rate Limiting (Prevent Brute Force)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit login/register to 20 attempts per hour
  message: "Too many authentication attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/customer-login", authLimiter);
app.use("/api/auth/register", authLimiter);

// 4. Stricter CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://daksha-food.vercel.app",
  "https://dakshacookiesmillets.com",
  "https://www.dakshacookiesmillets.com",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or allow matching origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["request-id"],
  }),
);

// ─── Utils & Logging ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("request-id", requestId);
  req.id = requestId;

  // ⚡ 2024 Cache-Prevention Fix: Force fresh content for all /api requests
  if (req.originalUrl.startsWith("/api/site/bootstrap")) {
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
  } else if (req.originalUrl.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }

  res.setHeader(
    "Permissions-Policy",
    "accelerometer=*, camera=(), geolocation=(), gyroscope=*, magnetometer=(), microphone=(), payment=*, usb=()",
  );

  logger.debug(`[${requestId}] ${req.method} ${req.path}`);
  next();
});

app.use(compression());
app.use(express.json({ limit: "10kb" })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize(req.body);
  if (req.query) {
    const sanitizedQuery = mongoSanitize(req.query);
    Object.keys(req.query).forEach(key => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }
  if (req.params) {
    const sanitizedParams = mongoSanitize(req.params);
    Object.keys(req.params).forEach(key => delete req.params[key]);
    Object.assign(req.params, sanitizedParams);
  }
  next();
});
app.use(hpp()); // Prevent HTTP Parameter Pollution
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ─── Caching Strategy ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  // Disable cache for Admin requests (Requests with Auth header)
  if (req.headers.authorization) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    return next();
  }

  // Cache public product endpoints for 5 minutes
  if (req.method === 'GET' && /^\/api\/(products|categories)/.test(req.path)) {
    res.set('Cache-Control', 'public, max-age=300'); 
  }
  // Cache static content for 1 hour
  else if (req.method === 'GET' && /^\/api\/(content|banners)/.test(req.path)) {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  // No cache for user-specific or admin endpoints
  else if (/^\/api\/(admin|customers|orders|auth)/.test(req.path)) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }
  next();
});

// ─── Root Route ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>🍪 Daksha Food Artisan API</h1>
      <p>Server is running. Documentation: <a href="/api/health">/api/health</a></p>
    </div>
  `);
});

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
app.use("/api/site", siteRoutes);

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
  logger.error(`${err.message}`, { stack: err.stack, requestId: req.id });

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS error: Origin not allowed" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Internal Server Error" 
      : err.message || "Internal Server Error",
  });
});

// ─── Listeners & Graceful Shutdown ─────────────────────────────────────────────
const server = app.listen(PORT, async () => {
    logger.info(`🚀 Backend Server running on http://localhost:${PORT}`);
    logger.info(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle graceful shutdown for database connections
const shutdown = async (signal) => {
    logger.info(`🛑 Signal received (${signal}). Closing connections...`);
    try {
        await mongoose.connection.close(false);
        logger.info('✅ MongoDB connection closed.');
        server.close(() => {
            logger.info('✅ Server HTTP terminated.');
            process.exit(0);
        });
    } catch {
        process.exit(1);
    }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default app;
