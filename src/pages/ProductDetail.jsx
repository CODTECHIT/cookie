import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSite } from '../context/SiteContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { API_URL } = useSite();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0,0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      if (data.success) {
        setProduct(data.data);
        if (data.data.variants?.length > 0) {
          setSelectedVariant(data.data.variants[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] uppercase tracking-[0.5em] font-black text-stone-300 animate-pulse">Brewing Product Info...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] font-serif italic text-primary">Product not found.</div>;

  const images = product.images?.length > 0 ? product.images.map(img => img.url) : ["https://via.placeholder.com/600"];

  return (
    <div className="pt-24 xl:pt-32 pb-40 px-4 xl:px-20 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-10">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-20 items-start">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 mb-6 border border-stone-100">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            {selectedVariant?.discount > 0 && (
              <div className="absolute top-6 left-6 bg-[#D4A017] text-white text-[10px] font-black px-4 py-2 rounded shadow-lg uppercase tracking-widest">
                {selectedVariant.discount}% OFF
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#D4A017]' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full lg:w-1/2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A017] mb-4 block">
            {product.categoryId?.name || 'Artisanal Collection'}
          </span>
          <h1 className="text-4xl xl:text-5xl font-serif font-black text-primary italic mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-stone-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-outlined text-sm ${i < (Math.floor(product.avgRating) || 5) ? 'text-[#D4A017] fill-1' : 'text-stone-300'}`}>star</span>
              ))}
              <span className="text-[11px] font-bold text-primary ml-2">{product.avgRating || 5.0}</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200">
              {product.reviewCount || 0} Verified Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-4xl font-black text-primary font-serif italic">₹{selectedVariant?.price}</span>
            {selectedVariant?.originalPrice > selectedVariant?.price && (
              <>
                <span className="text-xl line-through text-stone-300 italic opacity-60 font-serif">₹{selectedVariant.originalPrice}</span>
                <span className="text-sm font-bold text-green-600 ml-2">Save ₹{selectedVariant.originalPrice - selectedVariant.price}</span>
              </>
            )}
          </div>

          <div className="text-sm text-stone-600 font-medium italic leading-relaxed mb-10 border-l-4 border-stone-100 pl-6">
            {product.shortDescription || product.description?.substring(0, 150) || 'Handcrafted with premium ingredients, following traditional recipes for ultimate taste and health.'}
          </div>

          {/* Weight Selection */}
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-5">Select Weight</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants?.map(v => (
                <button 
                  key={v._id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-bold transition-all border ${
                    selectedVariant?._id === v._id 
                    ? 'bg-[#331917] border-[#331917] text-white shadow-xl scale-105' 
                    : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Qty and Actions */}
          <div className="flex items-center gap-8 mb-10">
             <div className="flex items-center gap-6 bg-stone-50 p-2 rounded-xl border border-stone-200 w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                <span className="text-sm font-bold text-primary">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
             </div>
             {(selectedVariant?.stockQty > 0 || product.totalStock > 0) ? (
               <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  In Stock: Ready to dispatch
               </span>
             ) : (
               <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Out of Stock
               </span>
             )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button className="bg-[#331917] text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all active:scale-95">
              <span className="material-symbols-outlined">shopping_bag</span>
              Add to Cart
            </button>
            <button className="bg-[#D4A017] text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-all active:scale-95">
              Buy Now
            </button>
          </div>

          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-red-500 transition-colors mb-12 w-fit mx-auto sm:mx-0">
             <span className="material-symbols-outlined text-sm">favorite</span>
             Save to Wishlist
          </button>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-10 py-10 border-t border-b border-stone-100 mb-12">
            {[
              { icon: "eco", text: "100% Natural" },
              { icon: "block", text: "No Preservatives" },
              { icon: "verified", text: "Hygienically Packed" },
              { icon: "workspace_premium", text: "Premium Quality" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#D4A017] text-lg">{f.icon}</span>
                <span className="text-xs font-bold text-stone-600 italic">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Full Description */}
          <div className="mb-12">
             <h3 className="text-sm font-bold text-primary italic mb-4 uppercase tracking-widest">Story & Details</h3>
             <p className="text-sm text-stone-500 leading-relaxed font-sans">
                {product.description || 'Our artisanal cookies are crafted using time-honored techniques. Every batch is carefully monitored to ensure the perfect crunch and rich flavor that Daksha is known for.'}
             </p>
          </div>

          {/* Check Delivery */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-primary italic">Check Delivery</h3>
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Free shipping above ₹999</span>
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                className="flex-grow bg-white border border-stone-200 rounded-xl px-6 py-4 text-xs font-bold text-primary focus:ring-1 focus:ring-[#D4A017] focus:border-[#D4A017] transition-all"
              />
              <button className="px-8 py-4 bg-transparent text-[#D4A017] font-black text-[10px] uppercase tracking-widest hover:bg-[#D4A017]/5 transition-all rounded-xl">Check</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


