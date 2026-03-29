import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Footer = () => {
  const { categories, settings } = useSite();

  return (
    <footer className="bg-primary text-secondary-fixed pt-20 pb-10 w-full relative overflow-hidden font-sans border-t border-white/5">
      {/* Glow / Ambient Lighting Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px] pointer-events-none translate-y-[-50%]"></div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          
          {/* Brand Identity Section */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex flex-col leading-none">
                <span className="text-5xl md:text-6xl font-serif font-black text-secondary-fixed tracking-tight uppercase italic group-hover:scale-105 transition-transform duration-500">DAKSHA</span>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-secondary-fixed/50 mt-2 italic">Artisanal Hearth & Heritage</span>
              </div>
            </Link>
            
            <p className="text-lg md:text-xl text-secondary-fixed/60 font-medium italic leading-relaxed max-w-md">
              Meticulously crafting India's finest handmade cookies and nourishing millet-based delicacies that honor our ancient culinary wisdom.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <SocialBtn icon="share" label="Instagram" />
              <SocialBtn icon="public" label="Facebook" />
              <SocialBtn icon="favorite" label="Pinterest" />
              <SocialBtn icon="mail" label="Twitter" />
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:pl-12">
            
            {/* Shop Categories */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/90 pb-2 border-b border-white/10 decoration-secondary decoration-2 underline-offset-8">Explore</h4>
              <ul className="space-y-4">
                {categories.slice(0, 5).map(c => (
                  <li key={c._id}>
                    <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to={`/products?category=${c._id}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li>
                    <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to="/products">
                      The Entire Range
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/90 pb-2 border-b border-white/10">The Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to="/services">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-8 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/90 pb-2 border-b border-white/10">Presence</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed/30 mb-1">Estate</p>
                  <p className="text-sm font-black uppercase italic text-secondary-fixed leading-tight">
                    {settings?.address || "Nuzvidu, Eluru, Andhra Pradesh, India"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed/30 mb-1">Direct Line</p>
                  <a href={`tel:${settings?.phone || "+919704254959"}`} className="text-sm font-black italic text-secondary-fixed hover:text-white transition-colors block">
                    {settings?.phone || "+91 9704254959"}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed/30 mb-1">Inquiries</p>
                  <a href={`mailto:${settings?.email || "dakshacookiesmillets@gmail.com"}`} className="text-xs font-black italic text-secondary-fixed hover:text-white transition-colors block break-all">
                    {settings?.email || "dakshacookiesmillets@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-secondary-fixed/20 italic text-center lg:text-left">
            © 2026 DAKSHA COOKIES & MILLETS • HANDCRAFTED WITH SOUL • EST. 2024
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-secondary-fixed/30 italic">
            <span className="hover:text-secondary-fixed cursor-default transition-colors">Artisan Hearth</span>
            <span className="hover:text-secondary-fixed cursor-default transition-colors">Sustainable</span>
            <span className="hover:text-secondary-fixed cursor-default transition-colors">Ethically Sourced</span>
          </div>
        </div>
      </div>

      {/* Mobile Interaction Safeguard */}
      <div className="h-20 lg:hidden"></div>
    </footer>
  );
};

const SocialBtn = ({ icon, label }) => (
  <button className="group relative flex items-center justify-center">
    <div className="w-12 h-12 rounded-2xl border border-secondary-fixed/10 flex items-center justify-center text-secondary-fixed/40 group-hover:bg-secondary-fixed group-hover:text-primary group-hover:border-secondary-fixed group-hover:scale-110 active:scale-95 transition-all duration-500">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-fixed text-primary text-[10px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest">
      {label}
    </span>
  </button>
);

export default Footer;

