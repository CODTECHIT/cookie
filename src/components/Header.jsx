import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const updateCart = () => setCartCount(parseInt(localStorage.getItem('cartCount') || '0'));
    
    updateCart(); // Initial load
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cookies', path: '/products' },
    { name: 'Millets', path: '/millets' },
    { name: 'Bundles', path: '/bundles' },
    { name: 'Offers', path: '/offers' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      {/* 🖥️ Desktop Header System (As per design.md) */}
      <div className="hidden lg:block">
        {/* Top Info Bar */}
        <div className="bg-primary text-secondary-fixed text-xs py-2 px-6 flex justify-between items-center tracking-wide font-medium z-[60] relative">
          <div className="flex items-center gap-6">
            <a href="tel:+919704254959" className="flex items-center gap-1.5 hover:text-white transition-colors">
               <span className="material-symbols-outlined text-[16px]">call</span> +91 9704254959
            </a>
            <span className="flex items-center gap-1.5 opacity-80">
               <span className="material-symbols-outlined text-[16px]">schedule</span> 07:00 AM – 07:00 PM
            </span>
          </div>
          <div className="flex items-center gap-1.5 uppercase tracking-widest opacity-80 hover:opacity-100 cursor-default">
            <span className="material-symbols-outlined text-[16px]">location_on</span> Eluru, Andhra Pradesh (521202)
          </div>
        </div>

        {/* Sticky Navbar */}
        <header className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'top-0 bg-white shadow-[0_10px_30px_-10px_rgba(51,25,23,0.1)]' : 'top-8 bg-white/80'} backdrop-blur-xl border-b border-primary/5`}>
          <div className="max-w-[1700px] mx-auto px-10 py-5 flex justify-between items-center transition-all duration-500">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary-fixed group-hover:rotate-12 transition-transform duration-500">
                <span className="material-symbols-outlined text-2xl font-black">cookie</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-serif font-black text-primary tracking-tight">DAKSHA</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Artisanal Treats</span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                   key={link.name} 
                   to={link.path}
                   className={`text-xs font-bold uppercase tracking-[0.2em] transition-all relative group/link ${
                     location.pathname === link.path ? 'text-primary' : 'text-stone-600 hover:text-primary'
                   }`}
                >
                   {link.name}
                   <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4A017] transition-all duration-500 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover/link:w-full'}`}></span>
                </Link>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-8">
              <div className="flex items-center bg-stone-100/50 rounded-xl px-4 py-2 border border-primary/5 focus-within:border-primary/20 focus-within:bg-white transition-all shadow-sm group/search">
                <span className="material-symbols-outlined text-stone-600 text-lg mr-2 group-focus-within/search:text-primary transition-colors">search</span>
                <input 
                   type="text" 
                   placeholder="Search products..." 
                   className="bg-transparent border-none focus:ring-0 text-xs w-48 font-sans font-bold placeholder:text-stone-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 rounded-full text-stone-600 hover:text-primary transition-all active:scale-90">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <Link to="/cart" className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 rounded-full text-stone-600 hover:text-primary transition-all relative active:scale-90">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-zoom-in">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button className="ml-2 bg-[#331917] text-[#ffe08e] px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95 shadow-xl shadow-primary/20">
                  Login
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 📱 Mobile Header (Flipkart Style - Keeping as optimized) */}
      <div className="lg:hidden">
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 bg-primary text-white ${scrolled ? 'shadow-lg' : ''}`}>
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(true)} className="material-symbols-outlined">menu</button>
              <Link to="/" className="font-serif text-lg font-black italic tracking-tight">Daksha</Link>
            </div>
            <div className="flex items-center gap-5">
              <span className="material-symbols-outlined text-[22px]">search</span>
              <Link to="/cart" className="relative block">
                <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1.5 bg-secondary text-[#331917] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
              </Link>
              <span className="text-xs font-black uppercase tracking-widest">Login</span>
            </div>
          </div>
          {/* Secondary Search Bar (Flipkart Style) */}
          <div className="px-3 pb-3">
             <div className="bg-white rounded-lg h-10 flex items-center px-3 gap-2 shadow-inner">
                <span className="material-symbols-outlined text-stone-400 text-lg">search</span>
                <input type="text" placeholder="Search for Cookies, Millets..." className="bg-transparent border-none focus:ring-0 text-xs text-primary font-bold w-full placeholder:text-stone-300" />
             </div>
          </div>
        </header>

        {/* Mobile Sidebar Menu */}
        <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
           <div className={`absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMenuOpen(false)}></div>
           <div className={`absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="p-6 h-full flex flex-col">
                 <div className="flex items-center justify-between mb-10">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-secondary-fixed">
                          <span className="material-symbols-outlined text-lg font-black">cookie</span>
                       </div>
                       <span className="text-lg font-serif font-black text-primary italic">DAKSHA</span>
                    </Link>
                    <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                       <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>
                 
                 <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                       <Link 
                          key={link.name} 
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                             location.pathname === link.path ? 'bg-primary text-secondary-fixed' : 'text-primary/60 hover:bg-primary/5'
                          }`}
                       >
                          <span className="text-xs font-black uppercase tracking-[0.2em]">{link.name}</span>
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                       </Link>
                    ))}
                 </nav>

                 <div className="mt-auto pt-10 border-t border-primary/5 space-y-6">
                    <div className="flex items-center gap-4 text-primary/60">
                       <span className="material-symbols-outlined">call</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">+91 9704254959</span>
                    </div>
                    <button className="w-full bg-primary text-secondary-fixed py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">
                       Sign In • Create Account
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Header;
