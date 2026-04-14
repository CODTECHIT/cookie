import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import SEO from "../components/SEO";
import { Truck, MapPin, CheckCircle, ShieldCheck } from "lucide-react";
import { getSafeImageUrl } from "../utils/imageUrl";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQty,
    subtotal,
    clearCart,
    shippingCost,
    isShippingFree,
    threshold,
  } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name,
        phone: user.phone,
      }));
    }
  }, [user]);

  // 💸 Calculate dynamic savings from product prices
  const savings = cartItems.reduce((acc, item) => {
    const itemSaving =
      (item.oldPrice || 0) > (item.price || 0)
        ? (item.oldPrice - item.price) * item.qty
        : 0;
    return acc + itemSaving;
  }, 0);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
          ? "/api"
          : "http://localhost:5000/api");
      const { data } = await axios.post(`${API_URL}/coupons/validate`, {
        code: couponCode,
        cartTotal: subtotal,
        userId: user?._id,
      });
      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponCode("");
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Could not apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const currentDiscount = appliedCoupon?.discountAmount || 0;
  const finalTotal = subtotal + shippingCost - currentDiscount;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place an order");
      navigate("/login");
      return;
    }

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      alert("Please complete your shipping address");
      return;
    }

    setLoading(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.PROD
          ? "/api"
          : "http://localhost:5000/api");

      // 1. Create order in backend
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          productName: item.title,
          image: getSafeImageUrl(item.img),
          variant: { weight: item.weight },
          quantity: item.qty,
          unitPrice: item.price,
          totalPrice: item.price * item.qty,
        })),
        grandTotal: finalTotal,
        deliveryCharge: shippingCost,
        subTotal: subtotal,
        discount: currentDiscount,
        couponCode: appliedCoupon?.code,
        couponId: appliedCoupon?.couponId,
        paymentMethod: "ONLINE",
        customerSnapshot: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          address: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state || "Andhra Pradesh",
            pincode: shippingAddress.pincode,
            landmark: shippingAddress.landmark,
          },
        },
      };

      const { data: orderResponse } = await axios.post(
        `${API_URL}/orders`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!orderResponse.success) throw new Error("Order creation failed");
      const localOrder = orderResponse.data;

      // 2. Create Razorpay Order
      const { data: rzpOrderResponse } = await axios.post(
        `${API_URL}/payments/razorpay-order`,
        {
          amount: finalTotal,
          receipt: localOrder.orderNumber,
          notes: { order_id: localOrder._id }, // Critical for Webhook Fallback
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const rzpOrder = rzpOrderResponse.data;
      const isRazorpayTestMode = (
        import.meta.env.VITE_RAZORPAY_KEY_ID || ""
      ).startsWith("rzp_test_");

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Daksha Food Artisan",
        description: isRazorpayTestMode
          ? `Order #${localOrder.orderNumber} (TEST MODE: use test card)`
          : "Order #" + localOrder.orderNumber,
        order_id: rzpOrder.id,
        // Allow all enabled Razorpay payment methods instead of forcing cards only.
        method: {
          card: true,
          upi: true,
          netbanking: true,
          wallet: true,
          emi: true,
          paylater: true,
        },
        retry: {
          enabled: true,
          max_count: 2,
        },
        handler: async (response) => {
          console.log("✅ Razorpay Success Response received:", response);
          try {
            setLoading(true);
            // 4. Verify Payment
            const verifyData = {
              orderId: localOrder._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              method: response?.method || "ONLINE",
            };

            console.log("⏳ Calling backend verify with:", verifyData);

            const { data: verifyResponse } = await axios.post(
              `${API_URL}/payments/verify`,
              verifyData,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            console.log("🏁 Backend verify response:", verifyResponse);

            if (verifyResponse.success) {
              clearCart();
              navigate("/my-orders", { state: { orderSuccess: true } });
            } else {
              console.error(
                "❌ Backend returned error:",
                verifyResponse.message,
              );
              alert(
                "Payment completed but verification returned an error. Your order has been recorded.",
              );
              setTimeout(() => navigate("/my-orders"), 2000);
            }
          } catch (err) {
            // Note: Razorpay SDK might log 400 errors from their API which can be ignored
            // if the payment actually went through. We rely on the webhook fallback.
            console.error("❌ Verification Error:", err);

            // Don't fail completely - the webhook might still process it
            if (err.response?.status === 401) {
              alert("Payment verification failed. Please contact support.");
            } else {
              alert(
                "Your payment is being processed. Please check your orders in a moment.",
              );
              setTimeout(() => navigate("/my-orders"), 3000);
            }
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: localOrder.customerSnapshot.name,
          contact: localOrder.customerSnapshot.phone,
          email: user?.email || "",
        },
        theme: { color: "#331917" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);

        // Surface real gateway decline reason instead of generic checkout failures.
        rzp.on("payment.failed", (response) => {
          console.error("❌ Razorpay payment.failed:", response?.error);
          setLoading(false);

          axios
            .post(
              `${API_URL}/payments/mark-failed`,
              {
                orderId: localOrder._id,
                error: response?.error || {},
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            .catch((markFailedErr) => {
              console.error(
                "❌ Failed to persist payment failure details:",
                markFailedErr,
              );
            });

          const code = response?.error?.code || "PAYMENT_FAILED";
          const description =
            response?.error?.description ||
            "Payment was declined by Razorpay. Please retry using Card in test mode.";
          const hint = isRazorpayTestMode
            ? "\nTest mode only accepts Razorpay test cards (for example 4111 1111 1111 1111, future expiry, any CVV, OTP 123456)."
            : "";

          alert(`Payment failed (${code}): ${description}${hint}`);
        });

        rzp.open();
      } else {
        throw new Error(
          "Razorpay SDK failed to load. Please check your internet connection.",
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Checkout failed");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <SEO
          title="Shopping Cart | Daksha Food Artisan"
          description="Your shopping cart is empty. Browse our collection of handcrafted cookies and millet products. Free shipping on orders above ₹999. Shop premium artisanal cookies online."
          keywords="shopping cart, bag, checkout, cookies online, buy cookies India"
          url={`${window.location.origin}/cart`}
        />
        <div className="pt-0 pb-24 px-4 xl:px-10 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-serif font-bold text-primary mb-4 italic">
              Shopping Bag
            </h1>
            <p className="text-stone-400">Your bag is currently empty.</p>
          </div>
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-[3rem] border border-stone-100">
            <span className="material-symbols-outlined text-7xl text-stone-200 mb-8">
              shopping_bag
            </span>
            <Link
              to="/products"
              className="bg-[#331917] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-xl transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Shopping Cart | Daksha Food Artisan"
        description="Review and manage your shopping cart. Add, remove, or update quantities of our handcrafted cookies and millet products before checkout. Free shipping above ₹999."
        keywords="shopping cart, bag, items, checkout, cookies online, buy cookies India"
        url={`${window.location.origin}/cart`}
      />
      <div className="pt-0 md:pt-28 pb-24 px-4 xl:px-10 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-primary italic mb-2">
            Shopping Bag
          </h1>
          <p className="text-xs md:text-sm font-medium text-stone-400 italic">
            You have {cartItems.length} items in your cart.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variantId}`}
                className="bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-4 flex gap-4 md:gap-6 items-center border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 md:w-32 md:h-32 xl:w-40 xl:h-40 rounded-xl md:rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={getSafeImageUrl(item.img)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.png";
                    }}
                  />
                </div>

                <div className="flex-grow flex flex-col sm:flex-row justify-between w-full h-full items-start">
                  <div className="flex flex-col h-full min-w-0">
                    <h3 className="text-sm md:text-xl font-bold text-primary mb-0.5 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] md:text-xs text-stone-400 font-medium mb-3 md:mb-6">
                      {item.weight} • {item.tagline}
                    </p>

                    {/* Qty Selector */}
                    <div className="flex items-center gap-4 md:gap-6 bg-stone-50 p-1 md:p-1.5 rounded-lg md:rounded-xl border border-stone-200 w-fit mt-auto">
                      <button
                        onClick={() => updateQty(item.id, item.variantId, -1)}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-stone-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          remove
                        </span>
                      </button>
                      <span className="text-[11px] md:text-sm font-bold text-primary">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.variantId, 1)}
                        className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-stone-400 hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end h-full justify-between sm:pt-2 ml-auto">
                    <span className="text-base md:text-2xl font-bold text-primary">
                      ₹{item.price * item.qty}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id, item.variantId)}
                      className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-primary/30 hover:text-red-600 transition-colors uppercase tracking-widest mt-auto mb-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        delete
                      </span>
                      <span className="hidden xs:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:gap-4 transition-all pt-6"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Continue Shopping
            </Link>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-primary" size={20} />
                <h2 className="text-xl font-serif font-black text-primary italic">
                  Shipping Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Receiver's name"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                      placeholder="10-digit number"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                    Flat / House / Street
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Detailed address"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        street: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                      placeholder="6-digit code"
                      value={shippingAddress.pincode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          pincode: e.target.value.replace(/\D/g, ""),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Eluru"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-stone-400 ml-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Nearby prominent place"
                    value={shippingAddress.landmark}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        landmark: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F8F5F0] rounded-[2.5rem] p-6 border border-stone-100">
              {/* Dynamic Shipping Message */}
              <div className="mb-8 bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3">
                <Truck
                  className={
                    isShippingFree ? "text-emerald-500" : "text-primary"
                  }
                  size={18}
                />
                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-black uppercase ${isShippingFree ? "text-emerald-600" : "text-primary"}`}
                  >
                    {isShippingFree
                      ? "Free Shipping Applied"
                      : "Artisanal Delivery"}
                  </span>
                  <span className="text-[10px] font-medium text-stone-400">
                    {isShippingFree
                      ? "Your order qualifies for complimentary shipping!"
                      : `Add ₹${threshold - subtotal} more for free delivery`}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-serif font-black text-primary italic mb-6">
                Price Details
              </h2>

              <div className="space-y-3 mb-6 text-sm font-medium">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-primary font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping Charges</span>
                  <span
                    className={`font-bold ${isShippingFree ? "text-emerald-600" : "text-primary"}`}
                  >
                    {isShippingFree ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                {currentDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">- ₹{currentDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#D4A017]">
                  <span>Total Savings</span>
                  <span className="font-bold">
                    - ₹{savings + currentDiscount}
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-xl font-serif font-black text-primary italic">
                    Grand Total
                  </span>
                  <span className="text-4xl font-serif font-black text-primary italic leading-none">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#331917] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95 mb-10 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-100 text-center">
                <span className="material-symbols-outlined text-[#D4A017] mb-2">
                  security
                </span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest text-center">
                  100% Secure & Encrypted Payments
                </span>
              </div>
            </div>

            <div className="bg-[#F8F5F0] border border-stone-100 rounded-[2rem] overflow-hidden">
              {appliedCoupon ? (
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase">
                        Coupon Applied!
                      </p>
                      <p className="text-sm font-black text-primary">
                        {appliedCoupon.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[10px] font-black uppercase text-red-500 hover:scale-105 transition-all"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-stone-600 mb-2">
                    <span className="material-symbols-outlined text-[#D4A017]">
                      sell
                    </span>
                    <span className="text-sm font-bold">Apply Coupon Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs font-bold outline-none uppercase placeholder:normal-case"
                      placeholder="Enter Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode}
                      className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] font-bold text-red-500 ml-2 italic">
                      {couponError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
