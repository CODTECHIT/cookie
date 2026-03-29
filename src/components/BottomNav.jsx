import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') return location.pathname.startsWith('/products') || location.pathname.startsWith('/category') || location.pathname.startsWith('/product');
    return location.pathname.startsWith(path);
  };
  
  const totalItems = cartCount || 0;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 pb-safe bg-background/90 backdrop-blur-lg z-50 border-t-[0.5px] border-primary/10 shadow-[0_-4px_20px_0_rgba(45,21,18,0.04)] font-body text-[10px] font-medium">
      <NavItem 
        to="/" 
        icon="home" 
        label="Home" 
        active={isActive('/')} 
      />
      <NavItem 
        to="/products" 
        icon="grid_view" 
        label="Collection" 
        active={isActive('/products')} 
      />
      <NavItem 
        to="/cart" 
        icon="shopping_cart" 
        label="Bag" 
        active={isActive('/cart')} 
        badge={totalItems > 0 ? totalItems : null}
      />
    </nav>
  );
};

const NavItem = ({ to, icon, label, active, badge }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all active:scale-90 relative ${
      active ? 'text-secondary-container' : 'text-primary/60'
    }`}
  >
    {active && (
      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary-container rounded-full shadow-[0_0_8px_rgba(254,210,85,0.6)]" />
    )}
    {badge && (
      <span className="absolute top-1 right-2 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
        {badge}
      </span>
    )}
    <span className={`material-symbols-outlined text-[24px] mb-0.5 ${active ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}>
      {icon}
    </span>
    <span className="font-sans font-semibold tracking-tight uppercase text-[8px]">{label}</span>
  </Link>
);

export default BottomNav;

