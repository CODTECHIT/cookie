import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { getSafeImageUrl } from "../utils/imageUrl";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const MyOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(
    location.state?.orderSuccess || false,
  );
  const [token] = useState(localStorage.getItem("token")); // Assuming token storage

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Tracking ID copied!");
  };

  const getStatusStep = (status) => {
    const steps = ["Pending", "Packed", "Shipped", "Delivered"];
    return steps.indexOf(status);
  };

  if (!token) {
    return (
      <>
        <SEO
          title="My Orders | Daksha Food Artisan"
          description="View and track your orders from Daksha Food Artisan. Monitor shipment status and manage your purchases of handcrafted cookies and millet products."
          keywords="my orders, order tracking, shipment status, cookies online, order history"
          url={`${window.location.origin}/my-orders`}
        />
        <div className="min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
          <div className="bg-stone-50 rounded-[3rem] p-12 border border-stone-100 w-full max-w-md text-center">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-3xl font-serif font-black text-primary italic mb-4">
              Account Required
            </h1>
            <p className="text-stone-500 mb-8">
              Please login to view your order history and track shipments.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#331917] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all hover:-translate-y-1"
            >
              LOGIN TO ACCOUNT
            </button>
            <Link
              to="/"
              className="block mt-6 text-xs font-bold text-stone-400 uppercase tracking-widest hover:text-primary transition-colors text-center"
            >
              RETURN TO HOME
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="My Orders | Daksha Food Artisan - Track Your Orders"
        description="View and track your orders from Daksha Food Artisan. Monitor shipment status, order history, and manage your purchases of artisanal cookies and millet products."
        keywords="my orders, order tracking, shipment status, cookies online, order history, order management"
        url={`${window.location.origin}/my-orders`}
      />
      <div className="pt-44 pb-20 px-4 md:px-8 max-w-6xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-primary mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <h1 className="text-5xl font-serif font-black text-primary italic leading-none">
              My Orders
            </h1>
            <p className="text-stone-400 font-medium mt-3 italic">
              Track your artisanal deliveries
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100">
            <span>Total Orders: {orders.length}</span>
            <div className="w-px h-4 bg-stone-200"></div>
            <span>
              Active:{" "}
              {
                orders.filter(
                  (o) => o.status !== "Delivered" && o.status !== "Cancelled",
                ).length
              }
            </span>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-12 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
              <Sparkles size={32} />
            </div>
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-serif font-black text-emerald-900 italic">
                Order Placed Successfully!
              </h2>
              <p className="text-emerald-700/70 font-medium text-sm mt-1">
                Thank you for choosing artisanal quality. Your order is now
                being processed.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 hover:text-emerald-900 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
              Retrieving Timeline...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 bg-stone-50 rounded-[4rem] border border-stone-100">
            <Package size={64} className="mx-auto text-stone-200 mb-6" />
            <p className="text-xl font-bold text-stone-400">
              No orders found yet
            </p>
            <Link
              to="/products"
              className="inline-block mt-8 bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group"
              >
                {/* Header Section */}
                <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-6 border-b border-stone-50 bg-stone-50/30">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">
                      Order ID: {order.orderNumber}
                    </p>
                    <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-bold text-primary">
                        ₹{order.grandTotal.toLocaleString()}
                      </h3>
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          order.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : order.status === "Cancelled"
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end justify-center">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                      Placed On
                    </p>
                    <p className="text-sm font-black text-primary">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Progress Tracker Visibility */}
                {order.status !== "Cancelled" && (
                  <div className="px-8 md:px-20 py-12 relative">
                    <div className="flex justify-between items-center relative z-10">
                      {[
                        { label: "Pending", icon: <Clock size={16} /> },
                        { label: "Packed", icon: <Package size={16} /> },
                        { label: "Shipped", icon: <Truck size={16} /> },
                        { label: "Delivered", icon: <CheckCircle size={16} /> },
                      ].map((step, idx) => {
                        const currentStep = getStatusStep(order.status);
                        const isCompleted = idx <= currentStep;
                        const isLast = idx === 3;

                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-4 relative"
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 shadow-md ${
                                isCompleted
                                  ? "bg-primary text-white"
                                  : "bg-stone-50 text-stone-300 border border-stone-100"
                              }`}
                            >
                              {step.icon}
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${
                                isCompleted ? "text-primary" : "text-stone-300"
                              }`}
                            >
                              {step.label}
                            </span>

                            {/* Connector Line */}
                            {!isLast && (
                              <div className="absolute left-[100%] top-6 w-[calc(100vw/5)] md:w-40 h-[2px] bg-stone-100 -z-10 translate-x-[-50%]">
                                <div
                                  className={`h-full bg-primary transition-all duration-1000 ${isCompleted && idx < currentStep ? "w-full" : "w-0"}`}
                                ></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Shipping & Tracking Specific Info */}
                {order.status !== "Cancelled" && (
                  <div className="mx-8 mb-8 p-8 bg-[#FDFBF7] rounded-[2.5rem] border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group/tracking">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/tracking:opacity-[0.08] transition-opacity">
                      <Truck
                        size={120}
                        className="-rotate-12 translate-x-8 translate-y-[-20px]"
                      />
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                      <div
                        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-500 ${order.trackingNumber ? "bg-primary text-white scale-110 shadow-primary/20" : "bg-white text-stone-300"}`}
                      >
                        {order.status === "Delivered" ? (
                          <CheckCircle size={28} />
                        ) : (
                          <Truck size={28} />
                        )}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase text-stone-400 tracking-widest leading-none mb-2">
                          {order.status === "Delivered"
                            ? "Delivery Confirmed"
                            : "Fulfillment Status"}
                        </p>
                        {order.trackingNumber ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <p className="text-lg font-black text-primary tracking-tight">
                                ID: {order.trackingNumber}
                              </p>
                              <button
                                onClick={() =>
                                  copyToClipboard(order.trackingNumber)
                                }
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-stone-300 hover:text-primary hover:shadow-md transition-all active:scale-90"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={10} className="text-secondary" />{" "}
                              {order.shippingCarrier || "Standard Carrier"}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <p className="text-lg font-black text-primary italic leading-tight">
                              Your package is under process
                            </p>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 animate-pulse">
                              Assigning transport partner...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                      {order.trackingUrl ? (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] shadow-xl shadow-primary/20 hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all"
                        >
                          Track Live Link <ExternalLink size={14} />
                        </a>
                      ) : order.trackingNumber ? (
                        <div className="bg-stone-50 text-stone-400 px-6 py-3 rounded-xl border border-stone-100 flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Awaiting Live Feed
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-stone-100/80 text-stone-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-dashed border-stone-200">
                          <Clock size={16} className="animate-spin-slow" />
                          Processing Order
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Items List (Collapsible / Summary) */}
                <div className="px-8 pb-10 space-y-4">
                  <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest border-b border-stone-50 pb-2">
                    Items Detail
                  </h4>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 flex-shrink-0">
                        <img
                          src={getSafeImageUrl(item.image)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary text-sm truncate">
                          {item.productName}
                        </p>
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
                          {item.variant.weight} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-primary">
                          ₹{item.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <CheckCircle />, label: "Guaranteed Quality" },
            { icon: <Truck />, label: "Fragile Handling" },
            { icon: <Package />, label: "Artisanal Packing" },
            { icon: <MapPin />, label: "Pan India Shipping" },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-6 bg-stone-50/50 rounded-3xl border border-stone-100 text-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              <div className="text-primary mb-3">{badge.icon}</div>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
