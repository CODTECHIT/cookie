import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSite } from "./SiteContext";
import { useToast } from "./ToastContext";
import { getSafeImageUrl } from "../utils/imageUrl";

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const { settings } = useSite();
  const { addToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const syncCart = async () => {
      if (cartItems.length === 0) return;
      try {
        const API_URL =
          import.meta.env.VITE_API_URL ||
          (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");
        const ids = cartItems.map((item) => item.id);
        const { data } = await axios.post(`${API_URL}/products/sync`, { ids });

        if (data.success) {
          const validProducts = data.data;
          setCartItems((prev) => {
            return prev
              .filter((item) => validProducts.some((p) => p._id === item.id))
              .map((item) => {
                const p = validProducts.find((prod) => prod._id === item.id);
                const v = p.variants?.find((variant) => variant.weight === item.weight);
                if (v) {
                  return { ...item, price: v.price, oldPrice: v.originalPrice };
                }
                return item;
              });
          });
        }
      } catch (err) {
        console.error("Cart Sync Failed:", err);
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
  }, [cartItems]);

  const addToCart = (product, variant, qty = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product._id && item.variantId === variant._id,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === product._id && item.variantId === variant._id
            ? { ...item, qty: item.qty + qty }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          variantId: variant._id,
          title: product.name,
          price: variant.price,
          oldPrice: variant.originalPrice,
          img: getSafeImageUrl(
            product.images?.find((i) => i.isMain)?.url ||
              product.images?.[0]?.url,
          ),
          weight: variant.weight,
          tagline: product.shortDescription || "Artisanal",
          qty,
        },
      ];
    });
    addToast(`${product.name} added to cart!`, 'cart');
  };

  const removeFromCart = (id, variantId) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.variantId === variantId)),
    );
  };

  const updateQty = (id, variantId, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.variantId === variantId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  // 🚚 Dynamic Shipping Logic from CMS Settings
  const shippingConfig = settings?.shippingBanner || {
    threshold: 999,
    enabled: true,
  };
  const isShippingFree = subtotal >= shippingConfig.threshold;
  const shippingCost = cartItems.length === 0 ? 0 : isShippingFree ? 0 : 100;

  const grandTotal = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        subtotal,
        shippingCost,
        isShippingFree,
        grandTotal,
        threshold: shippingConfig.threshold,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
