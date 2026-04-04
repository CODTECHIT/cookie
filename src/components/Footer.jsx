import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Footer = () => {
  const { categories } = useSite();

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
              <a href="https://wa.me/919704254959?text=Hello%21%20I%27m%20interested%20in%20Daksha%20Cookies%20%26%20Millets.%20Can%20you%20please%20provide%20more%20information%3F" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl border border-secondary-fixed/10 flex items-center justify-center text-secondary-fixed/40 group-hover:bg-secondary-fixed group-hover:text-primary group-hover:border-secondary-fixed group-hover:scale-110 active:scale-95 transition-all duration-500">
                  <svg className="text-xl" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-fixed text-primary text-[10px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest">
                  WhatsApp
                </span>
              </a>
              <a href="https://www.instagram.com/dakshacookiesmillets?igsh=MXJocjk5Ym5tdm9paQ==" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl border border-secondary-fixed/10 flex items-center justify-center text-secondary-fixed/40 group-hover:bg-secondary-fixed group-hover:text-primary group-hover:border-secondary-fixed group-hover:scale-110 active:scale-95 transition-all duration-500">
                  <svg className="text-xl" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.21-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-fixed text-primary text-[10px] font-black uppercase px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-widest">
                  Instagram
                </span>
              </a>
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
                <li>
                  <Link className="text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40 hover:text-white hover:translate-x-2 transition-all inline-block" to="/contact">
                    Contact Us
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
                    Nuzvidu, Eluru, Andhra Pradesh - 521202
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed/30 mb-1">Direct Line</p>
                  <a href="tel:+919704254959" className="text-sm font-black italic text-secondary-fixed hover:text-white transition-colors block">
                    +91 9704254959
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary-fixed/30 mb-1">Inquiries</p>
                  <a href="mailto:dakshacookiesmillets@gmail.com" className="text-xs font-black italic text-secondary-fixed hover:text-white transition-colors block break-all">
                    dakshacookiesmillets@gmail.com
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

          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-secondary-fixed/30 italic text-center lg:text-right">
            Designed by <a href="https://www.codtechitsolutions.com/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-fixed transition-colors">CODE IT TECH SOLUTIONS</a>
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

