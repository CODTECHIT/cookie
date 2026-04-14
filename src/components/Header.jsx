import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { categories, coupons } = useSite();
  const { cartCount } = useCart();
  const { user, logout } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const activeCoupon = coupons?.[0]; // Show the first active coupon campaign

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Shop",
      path: "/products",
      dropdown:
        categories.length > 0
          ? categories.map((c) => ({
              name: c.name,
              path: `/category/${c.slug || c._id}`,
            }))
          : [{ name: "All Products", path: "/products" }],
    },
    { name: "Services", path: "/services" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "My Orders", path: "/my-orders" },
  ];

  return (
    <>
      {/* 🎟️ Top Coupon Banner */}
      {activeCoupon && (
        <div className="hidden lg:flex bg-[#331917] text-[#fed255] py-2 px-4 text-center text-[10px] font-black uppercase tracking-[0.3em] z-[60] relative min-h-[32px] items-center justify-center">
          <span className="italic flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xs">sell</span>
            Limited Offer: Use code {activeCoupon.code} to get{" "}
            {activeCoupon.discountType === "percentage"
              ? `${activeCoupon.discountValue}%`
              : `₹${activeCoupon.discountValue}`}{" "}
            off! • {activeCoupon.description}
          </span>
        </div>
      )}

      {/* 🖥️ Desktop Header System (As per design.md) */}
      <div className="hidden lg:block">
        {/* Fixed Header */}
        <header
          className={`fixed ${activeCoupon && !scrolled ? "top-8" : "top-0"} w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? "bg-white shadow-[0_10px_30px_-10px_rgba(51,25,23,0.1)]" : "bg-white/80"} backdrop-blur-xl border-b border-primary/5`}
        >
          <div className="max-w-[1700px] mx-auto px-10 py-5 flex justify-between items-center transition-all duration-500">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner">
                <img
                  src="/logo.png"
                  alt="Daksha Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-serif font-black text-primary tracking-tight uppercase">
                  DAKSHA
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 opacity-60 italic">
                  Artisanal Treats
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group/nav">
                  <Link
                    to={link.path}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 flex items-center gap-1.5 ${
                      location.pathname === link.path
                        ? "text-primary"
                        : "text-stone-500 hover:text-primary"
                    }`}
                  >
                    {link.name}
                    {link.dropdown && (
                      <span className="material-symbols-outlined text-sm transition-transform group-hover/nav:rotate-180">
                        expand_more
                      </span>
                    )}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-[#D4A017] transition-all duration-500 ${location.pathname === link.path ? "w-full" : "w-0 group-hover/nav:w-full"}`}
                    ></span>
                  </Link>

                  {link.dropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 invisible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:visible transition-all duration-300 z-50">
                      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(51,25,23,0.2)] border border-primary/5 p-4 min-w-[240px] grid grid-cols-1 gap-1">
                        <div className="px-4 py-2 border-b border-stone-50 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
                            Discover Collections
                          </span>
                        </div>
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="px-4 py-3 rounded-xl hover:bg-stone-50 text-[11px] font-black text-stone-600 hover:text-primary transition-all flex items-center justify-between group/sub"
                          >
                            {sub.name}
                            <span className="material-symbols-outlined text-xs opacity-0 group-hover/sub:opacity-100 translate-x-[-10px] group-hover/sub:translate-x-0 transition-all">
                              arrow_forward
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-6">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-stone-100/50 rounded-xl px-4 py-2 border border-primary/5 focus-within:border-primary/20 focus-within:bg-white transition-all shadow-sm group/search"
              >
                <span
                  className="material-symbols-outlined text-stone-600 text-lg mr-2 group-focus-within/search:text-primary transition-colors cursor-pointer"
                  onClick={handleSearchSubmit}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs w-48 font-sans font-bold placeholder:text-stone-400"
                />
              </form>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 rounded-full text-stone-600 hover:text-primary transition-all active:scale-90">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <Link
                  to="/cart"
                  className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 rounded-full text-stone-600 hover:text-primary transition-all relative active:scale-90"
                >
                  <span className="material-symbols-outlined">
                    shopping_cart
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-zoom-in">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {user ? (
                  <div className="flex items-center gap-4 ml-2 group/user relative">
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 pl-4 border-l border-primary/10 group-hover/user:translate-x-[-2px] transition-all hover:opacity-80"
                    >
                      <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-secondary-fixed text-primary flex items-center justify-center font-black text-sm shadow-inner uppercase border border-primary/5 group-hover/user:scale-110 transition-transform duration-500 ring-2 ring-transparent group-hover/user:ring-tertiary/20">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-stone-400 leading-none mb-0.5">
                          Welcome back,
                        </span>
                        <span className="text-xs xl:text-[13px] font-black text-primary truncate max-w-[100px] tracking-tight">
                          {user.name.split(" ")[0]}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={logout}
                      className="w-10 h-10 flex items-center justify-center bg-stone-50 hover:bg-red-50 text-stone-300 hover:text-red-500 rounded-xl transition-all border border-stone-100 hover:border-red-100 active:scale-90"
                      title="Logout"
                    >
                      <span className="material-symbols-outlined text-lg">
                        logout
                      </span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="ml-2 bg-primary text-secondary-fixed px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95 shadow-xl shadow-primary/20 block"
                  >
                    Login / Sign up
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* 📱 Mobile Header (Flipkart Style - Keeping as optimized) */}
      <div className="lg:hidden">
        {/* Dynamic margin to push content down below fixed header */}
        <div className={activeCoupon ? "h-[140px]" : "h-[108px]"} />
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-300 bg-primary text-white ${scrolled ? "shadow-lg" : ""}`}
        >
          {/* Top Banner (Integrated into Header for better sync) */}
          {activeCoupon && (
            <div className="bg-[#331917] text-[#fed255] py-2 px-4 text-center text-[9px] font-black uppercase tracking-[0.2em] relative min-h-[32px] flex items-center justify-center border-b border-white/5">
              <span className="italic flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[10px]">
                  sell
                </span>
                {activeCoupon.code}:{" "}
                {activeCoupon.discountType === "percentage"
                  ? `${activeCoupon.discountValue}%`
                  : `₹${activeCoupon.discountValue}`}{" "}
                OFF!
              </span>
            </div>
          )}

          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="material-symbols-outlined text-xl"
              >
                menu
              </button>
              <Link
                to="/"
                className="font-serif text-xl font-black italic tracking-tight uppercase"
              >
                Daksha
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link
                  to="/my-orders"
                  className="w-8 h-8 rounded-full bg-[#fed255] flex items-center justify-center text-primary font-black text-[10px] shadow-lg"
                >
                  {user.name.charAt(0)}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          {/* Secondary Search Bar (Flipkart Style) */}
          <div className="px-3 pb-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-xl h-10 flex items-center px-4 gap-3 shadow-inner"
            >
              <span className="material-symbols-outlined text-stone-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search for Cookies, Millets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs text-primary font-bold w-full placeholder:text-stone-300"
              />
            </form>
          </div>
        </header>

        {/* Mobile Sidebar Menu */}
        <div
          className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible pointer-events-none"}`}
        >
          <div
            className={`absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div
            className={`absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-background shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-10">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Daksha Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-lg font-serif font-black text-primary italic">
                    DAKSHA
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary"
                >
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
                      location.pathname === link.path
                        ? "bg-primary text-secondary-fixed"
                        : "text-primary/60 hover:bg-primary/5"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                      {link.name}
                    </span>
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-primary/5 space-y-6">
                <a href="https://wa.me/919704254959?text=Hello%21%20I%27m%20interested%20in%20Daksha%20Cookies%20%26%20Millets.%20Can%20you%20please%20provide%20more%20information%3F" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-primary/60 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">call</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    +91 9704254959
                  </span>
                </a>
                {user ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-[9px] font-black uppercase text-primary/40 leading-none mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-black text-primary">
                        {user.name}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-primary text-secondary-fixed py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl block text-center"
                  >
                    Sign In • Create Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
