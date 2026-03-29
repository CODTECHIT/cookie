import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Services from './pages/Services';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MyOrders from './pages/MyOrders';
import BottomNav from './components/BottomNav';

// Admin Imports
import { SiteProvider } from './context/SiteContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { AdminProvider, useAdmin } from './admin/context/AdminContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/Login';
import AdminDashboard from './admin/pages/Dashboard';
import ProductsManagement from './admin/pages/Products';
import OrdersManagement from './admin/pages/Orders';
import CustomersManagement from './admin/pages/Customers';
import PaymentsManagement from './admin/pages/Payments';
import ReportsManagement from './admin/pages/Reports';
import CouponsManagement from './admin/pages/Coupons';
import CategoriesManagement from './admin/pages/Categories';
import ContentCMS from './admin/pages/ContentCMS';
import ReviewsManagement from './admin/pages/Reviews';
import SettingsManagement from './admin/pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdmin();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-[0.5em] font-black text-gray-300 animate-pulse">Initializing Secure Layer...</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

// Customer Layout Wrapper
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen overflow-x-hidden bg-background">
    <Header />
    <main className="flex-grow pb-24 lg:pb-0">{children}</main>
    <BottomNav />
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <SiteProvider>
        <CartProvider>
          <UserProvider>
            <AdminProvider>
            <Router>
            <Routes>
              {/* CUSTOMER ROUTES */}
              <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
              <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
              <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
              <Route path="/category/:categorySlug" element={<CustomerLayout><Products /></CustomerLayout>} />
              <Route path="/millets" element={<CustomerLayout><Products /></CustomerLayout>} />
              <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
              <Route path="/services" element={<CustomerLayout><Services /></CustomerLayout>} />
              <Route path="/privacy-policy" element={<CustomerLayout><PrivacyPolicy /></CustomerLayout>} />
              <Route path="/my-orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />

              {/* ADMIN ROUTES */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductsManagement />} />
                <Route path="orders" element={<OrdersManagement />} />
                <Route path="customers" element={<CustomersManagement />} />
                <Route path="payments" element={<PaymentsManagement />} />
                <Route path="reports" element={<ReportsManagement />} />
                <Route path="coupons" element={<CouponsManagement />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="reviews" element={<ReviewsManagement />} />
                <Route path="content" element={<ContentCMS />} />
                <Route path="settings" element={<SettingsManagement />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          </AdminProvider>
          </UserProvider>
        </CartProvider>
      </SiteProvider>
    </HelmetProvider>
  );
}

export default App;
