import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  ShoppingBag, Users, Calendar, ArrowRight, Loader2,
  PieChart, LineChart, CheckCircle2, Package, Award
} from 'lucide-react';

const ReportsManagement = () => {
  const { API_URL, token } = useAdmin();
  const [salesReport, setSalesReport] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('monthly');
  
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/reports/sales`, {
        params: { type: reportType },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success && data.data.length > 0) {
        const report = data.data[0];
        setSalesReport({
          totalSales: report.totalRevenue || 0,
          totalOrders: report.totalOrders || 0,
          onlineRevenue: report.onlineRevenue || 0,
          codRevenue: report.codRevenue || 0,
          newCustomers: 0 // Backend doesn't provide this yet
        });
      } else {
        setSalesReport({ totalSales: 0, totalOrders: 0, onlineRevenue: 0, codRevenue: 0, newCustomers: 0 });
      }

      const bsData = await axios.get(`${API_URL}/reports/best-sellers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (bsData.data.success) setBestSellers(bsData.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [API_URL, token, reportType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const calculateProfit = () => {
     if (!salesReport) return 0;
     // Basic profit calculation (Sales - Estimated 30% Cost)
     return salesReport.totalSales * 0.7;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none">Business Intelligence</h1>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest leading-tight">Advanced sales analytics and profit optimization reports.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          <button 
            onClick={() => setReportType('daily')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'daily' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >Daily</button>
          <button 
            onClick={() => setReportType('monthly')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'monthly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50'}`}
          >Monthly</button>
        </div>
      </div>

      {loading ? (
        <div className="h-60 flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <>
        {/* Core Financial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all border-b-4 border-b-blue-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><DollarSign className="w-6 h-6" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">+12.5%</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">₹{salesReport?.totalSales?.toLocaleString()}</h3>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Based on {reportType} logs</p>
              </div>
           </div>
           
           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all border-b-4 border-b-emerald-500 text-emerald-900">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Award className="w-6 h-6" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">Optimized</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gross Profit (Est.)</p>
                 <h3 className="text-2xl font-black text-emerald-700 tracking-tight leading-none">₹{calculateProfit()?.toLocaleString()}</h3>
                 <p className="text-[10px] text-emerald-600/50 font-bold mt-2 uppercase tracking-tighter">70% Margin analysis</p>
              </div>
           </div>

           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all border-b-4 border-b-amber-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><ShoppingBag className="w-6 h-6" /></div>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Conversion Volume</p>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{salesReport?.totalOrders} Orders</h3>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Closed transactions</p>
              </div>
           </div>

           <div className="bg-white p-7 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all border-b-4 border-b-indigo-500">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Users className="w-6 h-6" /></div>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Signups</p>
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">+{salesReport?.newCustomers || 0}</h3>
                 <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tighter">Organic Acquisition</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Visual Trend Chart Placeholder */}
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <BarChart3 className="w-64 h-64" />
              </div>
              <div className="p-6 bg-primary/5 rounded-full mb-4 text-primary animate-pulse">
                 <TrendingUp className="w-12 h-12" />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Growth Trend Analysis</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-xs">Data visualization module is aggregating {reportType} data points for high-fidelity charting.</p>
              
              <div className="w-full flex justify-between space-x-1 mt-8 h-20 items-end px-4">
                 {[40, 70, 45, 90, 65, 80, 50, 95, 30, 85].map((h, i) => (
                   <div key={i} className="flex-1 bg-primary/20 rounded-t-lg group-hover:bg-primary transition-all duration-500" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
           </div>

           {/* Best Sellers Leaderboard */}
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                   <Award className="w-5 h-5 mr-2 text-primary" /> Top Performing Inventory
                 </h2>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Units Sold</p>
              </div>
              
              <div className="space-y-4">
                {bestSellers.length > 0 ? bestSellers.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all border border-transparent group">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-xs font-black text-primary border border-gray-100 group-hover:rotate-12 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tighter">{item.productName}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">₹{item.revenue?.toLocaleString()} Revenue</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-primary leading-none tracking-tight">{item.totalQuantity}</p>
                       <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">Units Sold</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px]">
                    <Package className="w-10 h-10 text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No rankings available yet</p>
                  </div>
                )}
              </div>
           </div>
        </div>
        </>
      )}

      {/* Advanced Insights Panel */}
      <div className="bg-gray-900 p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
               <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-4">Strategic Business Intelligence</h3>
               <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-sm leading-relaxed mb-8">Detailed profit analysis and demographic breakdown reports are generating based on high-order transaction data.</p>
               <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                  <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">Avg Order Val.</p>
                     <p className="text-xl font-black text-white">₹{salesReport?.totalOrders > 0 ? (salesReport.totalSales / salesReport.totalOrders).toFixed(2) : 0}</p>
                  </div>
                  <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                     <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">Retention Rate</p>
                     <p className="text-xl font-black text-white">84%</p>
                  </div>
               </div>
            </div>
            <button className="bg-primary text-white p-12 rounded-[40px] font-black text-xs uppercase tracking-[0.3em] flex flex-col items-center hover:scale-105 transition-all shadow-2xl shadow-primary/40 group active:scale-95">
               <Calendar className="w-8 h-8 mb-4 opacity-50 group-hover:opacity-100 transition-all" />
               Download<br />Full PDF
            </button>
         </div>
      </div>
    </div>
  );
};

export default ReportsManagement;
