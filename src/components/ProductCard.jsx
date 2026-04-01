import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={product.title}
          src={product.image || "/placeholder-product.png"}
          onError={(e) => { e.target.src = "/placeholder-product.png"; }}
        />
        {product.discount && (
          <div className="absolute top-3 left-3 bg-tertiary text-white text-[10px] font-bold px-2 py-1 rounded">
            {product.discount} OFF
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-primary backdrop-blur hover:bg-primary hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-tertiary-container mb-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-sm ${i < Math.floor(product.rating) ? 'fill-1' : ''}`}
              style={{ fontVariationSettings: i < Math.floor(product.rating) ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          ))}
          <span className="text-on-surface-variant text-[10px] ml-1">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-lg text-primary mb-1 hover:text-tertiary transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-on-surface-variant text-xs mb-3">{product.weight}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-serif font-bold text-primary">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-stone-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        <button className="w-full bg-primary text-secondary-fixed py-3 rounded-lg font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 group/btn">
          <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">shopping_bag</span> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
