import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-surface-container-lowest rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-stone-100">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={product.title}
          src={product.image || "/placeholder-product.png"}
          onError={(e) => {
            e.target.src = "/placeholder-product.png";
          }}
        />
        {product.discount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-tertiary text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl">
            {product.discount} OFF
          </div>
        )}
        <button className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white/80 rounded-full flex items-center justify-center text-primary backdrop-blur hover:bg-primary hover:text-white transition-colors hover:scale-110">
          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
            favorite
          </span>
        </button>
      </div>

      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-tertiary-container mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-xs sm:text-sm ${i < Math.floor(product.rating) ? "fill-1" : ""}`}
              style={{
                fontVariationSettings:
                  i < Math.floor(product.rating) ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              star
            </span>
          ))}
          <span className="text-on-surface-variant text-[8px] sm:text-[10px] ml-1">
            ({product.reviews})
          </span>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-primary mb-1 hover:text-tertiary transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-on-surface-variant text-[10px] sm:text-xs mb-2 sm:mb-3">
          {product.weight}
        </p>

        <div className="flex items-center gap-2 mb-3 sm:mb-4 mt-auto">
          <span className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-primary">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-stone-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <button className="w-full bg-primary text-secondary-fixed py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2 group/btn active:scale-95">
          <span className="material-symbols-outlined text-sm sm:text-base group-hover/btn:scale-110 transition-transform">
            shopping_bag
          </span>
          <span className="hidden sm:inline">Add to Cart</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
