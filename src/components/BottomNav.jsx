import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
      />
      <NavItem 
        to="/about" 
        icon="person" 
        label="About" 
        active={isActive('/about')} 
      />
    </nav>
  );
};

const NavItem = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 ${
      active ? 'text-secondary-fixed relative after:content-[""] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full' : 'text-primary/60'
    }`}
  >
    <span className={`material-symbols-outlined text-[24px] mb-0.5 ${active ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}>
      {icon}
    </span>
    <span className="font-sans font-semibold tracking-tight uppercase text-[8px]">{label}</span>
  </Link>
);

export default BottomNav;
