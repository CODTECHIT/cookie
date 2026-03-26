import React from 'react';
import { Link } from 'react-router-dom';

const FlipkartCard = ({ p }) => {
  const discount = p.oldPrice && p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  
  // Stable rating and review count based on ID
  const rating = p.rating || (4.5 + (p.id % 5) * 0.1).toFixed(1);
  const reviews = p.reviews || ((p.id * 73) % 250) + 50;

  return (
    <div className="group flex flex-col animate-zoom-in">
      <Link 
        to={`/product/${p.id}`} 
        className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-stone-100 mb-3 md:mb-6"
      >
        <img 
          src={p.img} 
          alt={p.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
        />
        
        {/* Badges */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-1 md:gap-2">
          {p.id % 3 === 0 && (
            <span className="bg-[#D4A017] text-white text-[7px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm uppercase tracking-wider">BEST SELLER</span>
          )}
          {p.id % 3 === 1 && (
            <span className="bg-[#4caf50] text-white text-[7px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm uppercase tracking-wider">HEALTHY</span>
          )}
          {p.id % 3 === 2 && (
            <span className="bg-[#2196f3] text-white text-[7px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm uppercase tracking-wider">NEW</span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-primary/40 hover:text-red-500 transition-all active:scale-90">
          <span className="material-symbols-outlined text-[16px] md:text-[20px]">favorite</span>
        </button>
      </Link>

      <div className="flex flex-col flex-grow px-1 md:px-2">
        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-2">
          <span className="material-symbols-outlined text-[12px] md:text-[14px] text-tertiary fill-1">star</span>
          <span className="text-[9px] md:text-[11px] font-bold text-primary">{rating} <span className="text-stone-400 font-medium md:ml-1">({reviews})</span></span>
        </div>

        {/* Title & Info */}
        <Link to={`/product/${p.id}`}>
          <h3 className="text-sm md:text-lg font-bold text-primary leading-tight mb-1 group-hover:text-secondary transition-colors line-clamp-2 h-10 md:h-auto">
            {p.title}
          </h3>
        </Link>
        <p className="text-[9px] md:text-[11px] text-stone-400 font-medium mb-3 md:mb-4">
          {p.weight || '250g'} • {p.tagline || 'Handcrafted'}
        </p>

        {/* Price and Add to Cart */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base md:text-xl font-bold text-primary">₹{p.price}</span>
            {p.oldPrice && (
              <span className="text-[10px] md:text-sm text-stone-300 line-through">₹{p.oldPrice}</span>
            )}
            {discount > 0 && (
              <span className="text-[9px] md:text-[11px] font-bold text-[#D4A017]">{discount}% OFF</span>
            )}
          </div>
        
        <button className="mt-3 md:mt-6 w-full py-2.5 md:py-4 bg-[#331917] hover:bg-[#4b2e2b] text-white rounded-lg md:rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 group/btn">
          <span className="material-symbols-outlined text-xs md:text-sm">shopping_bag</span>
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default FlipkartCard;

