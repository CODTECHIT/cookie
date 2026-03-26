import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  TrendingUp, TrendingDown, ShoppingCart, DollarSign, 
  Package, AlertTriangle, ArrowRight, Loader2, Ticket, Grid, Star, Image
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} flex items-center`}>
          {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { API_URL, token } = useAdmin();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL, token]);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Overview Dashboard</h1>
          <p className="text-gray-500">Track your business performance and key metrics in real-time.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg shadow-sm">Daily</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">Monthly</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingCart} 
          trend={12} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Sales" 
          value={`₹${stats?.totalSales?.toLocaleString() || 0}`} 
          icon={DollarSign} 
          trend={8.5} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Today's Orders" 
          value={stats?.todayOrders || 0} 
          icon={Package} 
          trend={-2.4} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Today's Sales" 
          value={`₹${stats?.todaySales?.toLocaleString() || 0}`} 
          icon={TrendingUp} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-gray-900">Low Stock Alert</h2>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-full">
              {stats?.lowStockProducts?.length || 0} items
            </span>
          </div>
          <div className="flex-1 space-y-4">
            {stats?.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.variants?.[0]?.weight || 'N/A'}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg whitespace-nowrap">
                    {product.totalStock} left
                  </span>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="p-4 bg-green-50 rounded-full mb-3 text-green-500">
                  <Package className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-gray-600">All products in stock</p>
                <p className="text-xs text-gray-400 mt-1 italic">Good job! Check back later.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 rounded-xl transition-all flex items-center justify-center group">
            Manage Inventory
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Placeholder for Quick Actions or Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Quick Actions & Performance
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Add Product', icon: Package, link: '/admin/products', color: 'bg-blue-50 text-blue-600' },
              { label: 'View All Orders', icon: ShoppingCart, link: '/admin/orders', color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Create Coupon', icon: Ticket, link: '/admin/coupons', color: 'bg-orange-50 text-orange-600' },
              { label: 'Update Stock', icon: Grid, link: '/admin/products', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Moderate Reviews', icon: Star, link: '/admin/reviews', color: 'bg-purple-50 text-purple-600' },
              { label: 'Edit Homepage', icon: Image, link: '/admin/content', color: 'bg-pink-50 text-pink-600' },
            ].map((action, i) => (
              <button 
                key={i} 
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-50 hover:border-primary/20 hover:shadow-md transition-all group hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl mb-3 transition-all group-hover:scale-110 ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-primary">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
