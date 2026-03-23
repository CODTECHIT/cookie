import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-secondary-fixed pt-16 xl:pt-24 pb-8 xl:pb-12 w-full z-10 transition-all duration-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tertiary opacity-5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2 hover:opacity-10 transition-opacity"></div>
      
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 px-10 relative">
        {/* Brand Info */}
        <div className="z-10 text-center md:text-left">
          <h3 className="font-serif text-4xl xl:text-5xl font-black text-secondary-fixed mb-6 xl:mb-8 leading-none italic">Daksha</h3>
          <p className="text-base xl:text-xl text-secondary-fixed/50 font-sans font-medium italic leading-relaxed mb-8 xl:mb-10 max-w-sm mx-auto md:mx-0">
            Preserving India's culinary heritage through handmade cookies and nutritious millet-based foods. From our heart to your home.
          </p>
          <div className="flex gap-4 xl:gap-6 items-center justify-center md:justify-start">
            <SocialBtn icon="share" />
            <SocialBtn icon="favorite" />
            <SocialBtn icon="public" />
          </div>
        </div>

        {/* Categories */}
        <div className="lg:pl-12">
          <h4 className="font-bold text-white mb-10 uppercase tracking-[0.4em] text-xs">The Collection</h4>
          <ul className="space-y-6 text-sm font-black uppercase tracking-[0.2em] italic">
            <li><Link className="text-secondary-fixed/40 hover:text-secondary-fixed transition-all hover:translate-x-2 block" to="/products">Best Sellers</Link></li>
            <li><Link className="text-secondary-fixed/40 hover:text-secondary-fixed transition-all hover:translate-x-2 block" to="/products">Heritage Range</Link></li>
            <li><Link className="text-secondary-fixed/40 hover:text-secondary-fixed transition-all hover:translate-x-2 block" to="/products">Gift Boxes</Link></li>
            <li><Link className="text-secondary-fixed/40 hover:text-secondary-fixed transition-all hover:translate-x-2 block" to="/products">Limited Drops</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className="lg:pl-12">
          <h4 className="font-bold text-white mb-10 uppercase tracking-[0.4em] text-xs">The Company</h4>
          <ul className="space-y-6 text-sm font-black uppercase tracking-[0.2em] italic text-secondary-fixed/40">
            <li><Link className="hover:text-secondary-fixed transition-all" to="/about">Our Story</Link></li>
            <li><Link className="hover:text-secondary-fixed transition-all" to="/privacy-policy">Privacy Policy</Link></li>
            <li><a href="mailto:dakshacookiesmillets@gmail.com" className="hover:text-secondary-fixed transition-all block truncate">dakshacookiesmillets@gmail.com</a></li>
            <li><span className="block opacity-60">07:00 AM – 07:00 PM</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="lg:pl-12">
           <h4 className="font-bold text-white mb-10 uppercase tracking-[0.4em] text-xs">Reach Us</h4>
           <div className="text-secondary-fixed opacity-40 font-black text-sm uppercase italic tracking-widest space-y-4">
              <p className="leading-relaxed">
                 Nuzvidu, Eluru <br />
                 Andhra Pradesh 521202
              </p>
              <a href="https://wa.me/919704254959" className="flex items-center gap-3 hover:text-white transition-colors mt-6 not-italic">
                 <span className="material-symbols-outlined">call</span> +91 9704254959
              </a>
           </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto mt-20 xl:mt-32 pt-8 xl:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 xl:gap-8 text-[8px] xl:text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic text-center md:text-left">
        <p>© 2026 Daksha Cookies & Millets. Curating Heritage.</p>
        <div className="flex flex-wrap justify-center items-center gap-6 xl:gap-12">
          <span className="hover:text-white cursor-help">India's Finest Artisan Hearth</span>
          <span className="hover:text-white cursor-help">Sustainable • Ethical • Tribal</span>
        </div>
      </div>
      
      {/* Mobile Spacer for Bottom Nav */}
      <div className="h-24 md:hidden"></div>
    </footer>
  );
};

const SocialBtn = ({ icon }) => (
  <button className="w-14 h-14 rounded-full border-2 border-white/5 flex items-center justify-center text-secondary-fixed/50 hover:bg-secondary-fixed hover:text-primary hover:border-secondary-fixed hover:scale-110 active:scale-95 transition-all duration-500">
    <span className="material-symbols-outlined">{icon}</span>
  </button>
);

export default Footer;
