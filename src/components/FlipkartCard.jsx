import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FlipkartCard = ({ p }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = p.oldPrice && p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;

  // Stable rating and review count based on ID
  const rating = p.rating || (4.5 + (p.id % 5) * 0.1).toFixed(1);
  const reviews = p.reviews || ((p.id * 73) % 250) + 50;

  return (
    <div className="group flex flex-col animate-zoom-in">
      <Link
        to={`/product/${p.slug || p.id}`}
        className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-stone-100 mb-2 md:mb-4"
      >
        <img
          src={p.img || "/placeholder-product.png"}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          onError={(e) => { e.target.src = "/placeholder-product.png"; }}
        />

        {/* Badges */}
        <div className="absolute top-1.5 md:top-3 left-1.5 md:left-3 flex flex-col gap-1 md:gap-1.5">
          {p.id % 3 === 0 && (
            <span className="bg-[#D4A017] text-white text-[6px] md:text-[7px] font-bold px-1 md:px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">BEST SELLER</span>
          )}
          {p.id % 3 === 1 && (
            <span className="bg-[#4caf50] text-white text-[6px] md:text-[7px] font-bold px-1 md:px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">HEALTHY</span>
          )}
          {p.id % 3 === 2 && (
            <span className="bg-[#2196f3] text-white text-[6px] md:text-[7px] font-bold px-1 md:px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">NEW</span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-1.5 md:top-3 right-1.5 md:right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-primary/40 hover:text-red-500 transition-all active:scale-90">
          <span className="material-symbols-outlined text-[14px] md:text-[16px]">favorite</span>
        </button>
      </Link>

      <div className="flex flex-col flex-grow px-1 md:px-1.5">
        {/* Rating */}
        <div className="flex items-center gap-1 md:gap-1 mb-1 md:mb-1.5">
          <span className="material-symbols-outlined text-[10px] md:text-[12px] text-tertiary fill-1">star</span>
          <span className="text-[8px] md:text-[10px] font-bold text-primary">{rating} <span className="text-stone-400 font-medium md:ml-1">({reviews})</span></span>
        </div>

        {/* Title & Info */}
        <Link to={`/product/${p.slug || p.id}`}>
          <h3 className="text-[10px] md:text-xs font-bold text-primary leading-tight mb-1 group-hover:text-secondary transition-colors line-clamp-2 h-6 md:h-auto">
            {p.title}
          </h3>
        </Link>
        <p className="text-[7px] md:text-[9px] text-stone-400 font-medium mb-1.5 md:mb-2">
          {p.weight || '250g'} • {p.tagline || 'Handcrafted'}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-baseline gap-1 flex-wrap mb-2 md:mb-3">
          <span className="text-xs md:text-sm font-bold text-primary">₹{p.price}</span>
          {p.oldPrice && (
            <span className="text-[9px] md:text-[10px] text-stone-300 line-through">₹{p.oldPrice}</span>
          )}
          {discount > 0 && <span className="text-[8px] md:text-[9px] font-bold text-[#D4A017] ml-auto">{discount}% OFF</span>}
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          <button
            onClick={() => addToCart({ _id: p.id, name: p.title, images: [{ url: p.img, isMain: true }], shortDescription: p.tagline }, { _id: 'default', price: p.price, originalPrice: p.oldPrice, weight: p.weight || '250g' })}
            className="py-2.5 md:py-3 bg-primary text-white rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-lg shadow-primary/5 group/btn"
          >
            <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.1em]">Add to Cart</span>
          </button>
          <button
            onClick={() => {
              addToCart({ _id: p.id, name: p.title, images: [{ url: p.img, isMain: true }], shortDescription: p.tagline }, { _id: 'default', price: p.price, originalPrice: p.oldPrice, weight: p.weight || '250g' });
              navigate('/cart');
            }}
            className="py-2.5 md:py-3 bg-tertiary text-white rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-lg shadow-tertiary/5 group/btn"
          >
            <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.1em]">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipkartCard;
