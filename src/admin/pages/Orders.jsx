import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { 
  ShoppingCart, Search, Filter, Eye, Truck, CheckCircle, 
  Clock, Package, XCircle, Loader2, Download, ExternalLink, 
  MapPin, Phone, Mail, Calendar, CreditCard, ChevronRight
} from 'lucide-react';

const OrdersManagement = () => {
  const { API_URL, token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [API_URL, token, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/orders`, {
        params: { status: statusFilter, search: searchTerm },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setOrders(data.data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    setStatusLoading(true);
    try {
      const { data } = await axios.patch(`${API_URL}/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        fetchOrders();
        if (selectedOrder) setSelectedOrder(data.data);
      }
    } catch (err) { alert('Status update failed'); }
    finally { setStatusLoading(false); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Packed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3 h-3 mr-1" />;
      case 'Packed': return <Package className="w-3 h-3 mr-1" />;
      case 'Shipped': return <Truck className="w-3 h-3 mr-1" />;
      case 'Delivered': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'Cancelled': return <XCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 font-medium">Process and fulfill customer orders efficiently.</p>
        </div>
        <div className="flex items-center space-x-2">
           <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-gray-200 bg-white">
             <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary flex-1 md:min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => { setSelectedOrder(o); setShowDetailModal(true); }}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">{o.orderNumber || `#${o._id.substring(0,8)}`}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">{new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 text-sm">{o.customerSnapshot?.name || o.customerId?.name}</p>
                      <p className="text-xs text-gray-400">{o.customerSnapshot?.phone || o.customerId?.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">₹{o.grandTotal?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{o.items?.length} items</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(o.status)} uppercase tracking-tighter`}>
                        {getStatusIcon(o.status)}
                        {o.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase ${o.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {o.paymentStatus}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{o.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all group-hover:scale-110">
                         <Eye className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
             
             {/* Left - Items & Summary */}
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar border-r border-gray-100 bg-gray-50/30">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-none">Order Details</h2>
                    <p className="text-sm font-bold text-primary mt-2 uppercase tracking-widest">{selectedOrder.orderNumber}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </div>
                </div>

                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">ORDERED ITEMS ({selectedOrder.items?.length})</h3>
                <div className="space-y-3 mb-8">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                        {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <Package className="w-6 h-6 text-gray-300 m-auto mt-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-blue-600 font-bold uppercase">{item.variant?.weight}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase leading-none mb-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-gray-900 leading-none">₹{item.totalPrice?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium">Subtotal</span><span className="text-gray-900 font-bold">₹{selectedOrder.subTotal?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm text-blue-600 font-bold"><span>Delivery Charge</span><span>+ ₹{selectedOrder.deliveryCharge || 0}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-sm text-emerald-600 font-bold"><span>Discount Applied ({selectedOrder.couponCode})</span><span>- ₹{selectedOrder.discount}</span></div>}
                  <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-lg">
                    <span className="text-gray-900 font-black uppercase tracking-tight">Total Amount</span>
                    <span className="text-primary font-black">₹{selectedOrder.grandTotal?.toLocaleString()}</span>
                  </div>
                </div>
             </div>

             {/* Right - Customer & Status Actions */}
             <div className="w-full md:w-[350px] overflow-y-auto p-8 border-l border-gray-100 space-y-8 bg-white z-10">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Info</h3>
                   <button onClick={() => setShowDetailModal(false)} className="md:hidden p-1 text-gray-400 hover:text-gray-600"><XCircle className="w-6 h-6" /></button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-gray-900">{selectedOrder.customerSnapshot?.name || selectedOrder.customerId?.name}</p><p className="text-xs text-gray-500 font-medium">Customer ID: {selectedOrder.customerId?._id?.substring(0,8) || 'GUEST'}</p></div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Phone className="w-4 h-4" /></div>
                    <div><p className="text-sm font-bold text-gray-700">{selectedOrder.customerSnapshot?.phone || selectedOrder.customerId?.phone}</p></div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin className="w-4 h-4" /></div>
                    <div className="text-xs text-gray-600 font-medium leading-relaxed">
                      {selectedOrder.customerSnapshot?.address?.street},<br />
                      {selectedOrder.customerSnapshot?.address?.city}, {selectedOrder.customerSnapshot?.address?.state}<br />
                      <span className="font-black text-gray-900 tracking-widest">{selectedOrder.customerSnapshot?.address?.pincode}</span>
                    </div>
                  </div>
                </div>

                <div>
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Payment Tracking</h3>
                   <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Method:</span>
                        <span className="font-black flex items-center"><CreditCard className="w-3 h-3 mr-1 text-primary" /> {selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Status:</span>
                        <span className={`font-black uppercase tracking-tighter ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedOrder.paymentStatus}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-3">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Fulfillment</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Update progress to keep customer informed</p>
                   
                   <div className="space-y-2">
                     {['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                       <button
                         key={status}
                         disabled={selectedOrder.status === status || statusLoading}
                         onClick={() => updateStatus(selectedOrder._id, status)}
                         className={`
                           w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between group
                           ${selectedOrder.status === status 
                             ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                             : 'bg-white border border-gray-100 text-gray-500 hover:border-primary/50 hover:text-primary hover:shadow-md'}
                           ${statusLoading && 'opacity-50 pointer-events-none'}
                         `}
                       >
                         <div className="flex items-center">
                           {getStatusIcon(status)}
                           <span>{status}</span>
                         </div>
                         {selectedOrder.status === status && <CheckCircle className="w-4 h-4 shrink-0" />}
                         {!statusLoading && selectedOrder.status !== status && <ChevronRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />}
                         {statusLoading && selectedOrder.status !== status && <Loader2 className="w-4 h-4 animate-spin text-gray-300" />}
                       </button>
                     ))}
                   </div>
                </div>

                <button onClick={() => setShowDetailModal(false)} className="w-full py-4 text-sm font-black text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 mt-4 transition-all active:scale-95">Close Details</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
