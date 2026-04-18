import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAdmin } from "../context/AdminContext";
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Star,
  Loader2,
  ArrowRight,
  ChevronRight,
  Calendar,
  ExternalLink,
  IndianRupee,
  X,
} from "lucide-react";

const CustomersManagement = () => {
  const { API_URL, token } = useAdmin();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [repeatFilter, setRepeatFilter] = useState(false);

  // Detail state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/customers`, {
        params: { repeat: repeatFilter, search: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setCustomers(data.data.customers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token, repeatFilter, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const fetchCustomerDetails = async (id) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    try {
      const { data } = await axios.get(`${API_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setSelectedCustomer(data.data.customer);
        setCustomerOrders(
          (data.data.orders || []).filter((o) => o.paymentStatus === "Paid"),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Data</h1>
          <p className="text-gray-500 font-medium">
            Insights and activity tracking for your loyal base.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setRepeatFilter(false)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${!repeatFilter ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
          >
            All
          </button>
          <button
            onClick={() => setRepeatFilter(true)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center ${repeatFilter ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <Star
              className={`w-4 h-4 mr-1 ${repeatFilter ? "fill-white" : ""}`}
            />{" "}
            Repeat Customers
          </button>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-primary outline-none text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchCustomers()}
          />
        </div>
      </div>

      {/* Customer List Grid */}
      {loading ? (
        <div className="p-20 flex justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((c) => (
            <div
              key={c._id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col animate-in fade-in duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl border-2 border-white shadow-sm ring-1 ring-gray-100 uppercase">
                    {c.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-black text-gray-900 truncate leading-none mb-1 uppercase tracking-tight">
                        {c.name}
                      </h3>
                      {c.isRepeatCustomer && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-bold truncate">
                      ID: {c._id.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                    Lifetime Value
                  </p>
                  <p className="text-lg font-black text-emerald-600 leading-none">
                    ₹{c.totalSpent?.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-center space-x-2 text-xs text-gray-600 font-bold">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{c.phone || "No phone"}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 font-bold">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{c.email || "No email"}</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-gray-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <p className="line-clamp-1">
                    {c.addresses?.[0]
                      ? `${c.addresses[0].city}, ${c.addresses[0].state}`
                      : "No address set"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-black text-primary leading-none">
                      {c.paidOrdersCount || 0}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                      Paid Orders
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => fetchCustomerDetails(c._id)}
                  className="px-4 py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center"
                >
                  Full Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Full Profile Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl h-[85vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            {detailLoading ? (
              <div className="w-full h-full flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Left Pane - Profile Details */}
                <div className="w-full md:w-[320px] bg-gray-50 p-8 flex flex-col items-center text-center border-r border-gray-100 overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="self-end md:hidden p-2"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                  <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-primary to-primary/40 text-white flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-primary/20 uppercase">
                    {selectedCustomer?.name?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">
                    {selectedCustomer?.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-6">
                    Customer Since{" "}
                    {new Date(selectedCustomer?.createdAt).getFullYear()}
                  </p>

                  {selectedCustomer?.isRepeatCustomer && (
                    <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center mb-8 shadow-sm">
                      <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />{" "}
                      Platinum Customer
                    </div>
                  )}

                  <div className="w-full space-y-4 mb-8">
                    <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-gray-100">
                      <p className="text-2xl font-black text-emerald-600 leading-none">
                        ₹{selectedCustomer?.totalSpent?.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        Lifetime Value
                      </p>
                    </div>
                    <div className="flex flex-col items-center bg-white p-4 rounded-2xl border border-gray-100">
                      <p className="text-2xl font-black text-blue-600 leading-none">
                        {selectedCustomer?.paidOrdersCount}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                        Paid Orders
                      </p>
                    </div>
                  </div>

                  <div className="w-full text-left space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Contact Info
                      </p>
                      <p className="text-sm font-bold text-gray-700 flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-2" />{" "}
                        {selectedCustomer?.phone}
                      </p>
                      <p className="text-sm font-bold text-gray-700 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-2" />{" "}
                        {selectedCustomer?.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase">
                        Active Addresses
                      </p>
                      {selectedCustomer?.addresses?.map((addr, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-500 flex items-start space-x-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            <span className="font-black text-gray-900 uppercase tracking-tighter">
                              {addr.pincode}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Pane - Order Activity */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-2 text-primary" />{" "}
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="hidden md:block p-2 text-gray-300 hover:text-gray-900 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {customerOrders.length > 0 ? (
                      customerOrders.map((o) => (
                        <div
                          key={o._id}
                          className="p-4 bg-white border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer border-l-4 border-l-primary"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900 leading-none uppercase tracking-tight">
                              {o.orderNumber || `#${o._id.substring(0, 8)}`}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(o.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              <div
                                className={`px-2 py-0.5 rounded-full ${o.status === "Delivered" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                              >
                                {o.status}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-center space-x-4">
                            <div>
                              <p className="text-base font-black text-gray-900 tracking-tight leading-none">
                                ₹{o.grandTotal?.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-gray-400 font-black uppercase mt-1">
                                {o.paymentStatus}
                              </p>
                            </div>
                            <div className="p-2 bg-gray-50 text-gray-300 rounded-full group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1">
                              <ChevronRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-40 flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                        <ShoppingBag className="w-10 h-10 text-gray-200 mb-3" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          No paid orders found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersManagement;
