import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import BottomNav from "./components/BottomNav";

// --- Lazy loaded Customer Pages ---
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Contexts
import { SiteProvider } from "./context/SiteContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { AdminProvider, useAdmin } from "./admin/context/AdminContext";
import { ToastProvider } from "./context/ToastContext";
import { CONFIG } from "./utils/config";

// --- Lazy loaded Admin Components ---
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/pages/Login"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const ProductsManagement = lazy(() => import("./admin/pages/Products"));
const OrdersManagement = lazy(() => import("./admin/pages/Orders"));
const CustomersManagement = lazy(() => import("./admin/pages/Customers"));
const PaymentsManagement = lazy(() => import("./admin/pages/Payments"));
const ReportsManagement = lazy(() => import("./admin/pages/Reports"));
const CouponsManagement = lazy(() => import("./admin/pages/Coupons"));
const CategoriesManagement = lazy(() => import("./admin/pages/Categories"));
const ContentCMS = lazy(() => import("./admin/pages/ContentCMS"));
const ReviewsManagement = lazy(() => import("./admin/pages/Reviews"));
const ShippingManagement = lazy(() => import("./admin/pages/Shipping"));

// Loading Component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background uppercase tracking-[0.5em] font-black text-gray-400 animate-pulse">
    Loading Module...
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-[0.5em] font-black text-gray-300 animate-pulse">
        Initializing Secure Layer...
      </div>
    );
  if (!admin) return <Navigate to={`${CONFIG.ADMIN_PATH_PREFIX}/login`} replace />;
  return children;
};

// Customer Layout Wrapper
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
    <Header />
    <main className="flex-grow pb-24 lg:pb-0">{children}</main>
    <BottomNav />
    <Footer />
    <WhatsAppButton />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <SiteProvider>
          <CartProvider>
            <UserProvider>
              <AdminProvider>
                <Router>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <CustomerLayout>
                            <Home />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <CustomerLayout>
                            <Login />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/forgot-password"
                        element={
                          <CustomerLayout>
                            <ForgotPassword />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <CustomerLayout>
                            <Register />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/products"
                        element={
                          <CustomerLayout>
                            <Products />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/category/:categorySlug"
                        element={
                          <CustomerLayout>
                            <Products />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/millets"
                        element={
                          <CustomerLayout>
                            <Products />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/product/:id"
                        element={
                          <CustomerLayout>
                            <ProductDetail />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <CustomerLayout>
                            <Cart />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <CustomerLayout>
                            <About />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/services"
                        element={
                          <CustomerLayout>
                            <Services />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <CustomerLayout>
                            <Contact />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/privacy-policy"
                        element={
                          <CustomerLayout>
                            <PrivacyPolicy />
                          </CustomerLayout>
                        }
                      />
                      <Route
                        path="/my-orders"
                        element={
                          <CustomerLayout>
                            <MyOrders />
                          </CustomerLayout>
                        }
                      />

                      {/* ADMIN ROUTES */}
                      <Route
                        path={`${CONFIG.ADMIN_PATH_PREFIX}/login`}
                        element={<AdminLogin />}
                      />
                      <Route
                        path={CONFIG.ADMIN_PATH_PREFIX}
                        element={
                          <ProtectedRoute>
                            <AdminLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route
                          index
                          element={
                            <Navigate
                              to={`${CONFIG.ADMIN_PATH_PREFIX}/dashboard`}
                              replace
                            />
                          }
                        />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route
                          path="products"
                          element={<ProductsManagement />}
                        />
                        <Route path="orders" element={<OrdersManagement />} />
                        <Route
                          path="customers"
                          element={<CustomersManagement />}
                        />
                        <Route
                          path="payments"
                          element={<PaymentsManagement />}
                        />
                        <Route path="reports" element={<ReportsManagement />} />
                        <Route path="coupons" element={<CouponsManagement />} />
                        <Route
                          path="categories"
                          element={<CategoriesManagement />}
                        />
                        <Route path="reviews" element={<ReviewsManagement />} />
                        <Route path="content" element={<ContentCMS />} />
                        <Route path="shipping" element={<ShippingManagement />} />
                      </Route>

                      {/* Fallback */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Router>
              </AdminProvider>
            </UserProvider>
          </CartProvider>
        </SiteProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
