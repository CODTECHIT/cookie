import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSite } from './SiteContext';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
  const { settings } = useSite();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // Trigger storage event for other components (like Header) if needed
    window.dispatchEvent(new Event('storage'));
  }, [cartItems]);

  const addToCart = (product, variant, qty = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product._id && item.variantId === variant._id);
      if (existingItem) {
        return prev.map(item => 
          (item.id === product._id && item.variantId === variant._id) 
            ? { ...item, qty: item.qty + qty } 
            : item
        );
      }
      return [...prev, {
        id: product._id,
        variantId: variant._id,
        title: product.name,
        price: variant.price,
        oldPrice: variant.originalPrice,
        img: product.images?.find(i => i.isMain)?.url || product.images?.[0]?.url,
        weight: variant.weight,
        tagline: product.shortDescription || 'Artisanal',
        qty
      }];
    });
  };

  const removeFromCart = (id, variantId) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.variantId === variantId)));
  };

  const updateQty = (id, variantId, delta) => {
    setCartItems(prev => prev.map(item => 
      (item.id === id && item.variantId === variantId) 
        ? { ...item, qty: Math.max(1, item.qty + delta) } 
        : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // 🚚 Dynamic Shipping Logic from CMS Settings
  const shippingConfig = settings?.shippingBanner || { threshold: 999, enabled: true };
  const isShippingFree = subtotal >= shippingConfig.threshold;
  const shippingCost = cartItems.length === 0 ? 0 : (isShippingFree ? 0 : 100);
  
  const grandTotal = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ 
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
      threshold: shippingConfig.threshold 
    }}>
      {children}
    </CartContext.Provider>
  );
};
