import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  BarChart3,
  Ticket,
  Grid,
  Image,
  Star,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const AdminLayout = () => {
  const { admin, logout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Products", path: "/admin/products", icon: ShoppingBag },
    { title: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { title: "Customers", path: "/admin/customers", icon: Users },
    { title: "Payments", path: "/admin/payments", icon: CreditCard },
    { title: "Reports", path: "/admin/reports", icon: BarChart3 },
    { title: "Coupons", path: "/admin/coupons", icon: Ticket },
    { title: "Categories", path: "/admin/categories", icon: Grid },
    { title: "Reviews", path: "/admin/reviews", icon: Star },
    { title: "Content", path: "/admin/content", icon: Image },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100 mb-6 bg-primary text-white">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <LayoutDashboard className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">
              Admin Console
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)] pb-20 custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary border-r-4 border-primary"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 z-30">
          <button
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div className="hidden lg:block text-sm text-gray-500 font-medium">
            Good morning, {admin?.name || "Admin"} 👋
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs ring-2 ring-white">
              {admin?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
