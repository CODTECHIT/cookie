import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSite } from '../context/SiteContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const { API_URL } = useSite();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`);
      if (data.success && data.data) {
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
  }, [API_URL, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id, fetchProduct]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to leave a review 🍪');
      return;
    }

    setSubmittingReview(true);
    try {
      const { data } = await axios.post(`${API_URL}/products/${id}/reviews`, reviewForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        alert('Review posted successfully! Thank you for your feedback. ✨');
        setReviewForm({ rating: 5, comment: '' });
        fetchProduct();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, qty);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="uppercase tracking-[0.5em] font-black text-stone-300 text-xs">Accessing Artisan Records...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center">
        <h2 className="text-2xl font-serif italic text-primary mb-4">Product Not Found</h2>
        <Link to="/products" className="px-8 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase">Return to Shop</Link>
      </div>
    );
  }

  const images = (product?.images?.length > 0) 
    ? product.images.map(img => img.url) 
    : ["https://via.placeholder.com/600"];

  return (
    <div className="pt-44 lg:pt-28 pb-24 px-4 xl:px-16 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
      <SEO 
        title={product.name}
        description={product.shortDescription || product.description?.substring(0, 160)}
        image={images[0]}
        type="product"
      />
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 items-start mb-24">
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 mb-4 border border-stone-100">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            {selectedVariant?.discount > 0 && (
              <div className="absolute top-6 left-6 bg-[#D4A017] text-white text-[10px] font-black px-4 py-2 rounded shadow-lg uppercase tracking-widest">
                {selectedVariant.discount}% OFF
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
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

        {/* Right: Product Info */}
        <div className="w-full lg:w-1/2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A017] mb-4 block">
            {product.categoryId?.name || 'Artisanal Collection'}
          </span>
          <h1 className="text-4xl xl:text-5xl font-serif font-black text-primary italic mb-6 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-outlined text-sm ${i < (Math.floor(product.avgRating) || 5) ? 'text-[#D4A017] fill-1' : 'text-stone-300'}`}>star</span>
              ))}
              <span className="text-[11px] font-bold text-primary ml-2">{product.avgRating || 5.0}</span>
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 font-sans">
              {product.reviewCount || 0} Verified Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-black text-primary font-serif italic">₹{selectedVariant?.price}</span>
            {selectedVariant?.originalPrice > selectedVariant?.price && (
              <span className="text-xl line-through text-stone-300 italic opacity-60 font-serif font-sans">₹{selectedVariant.originalPrice}</span>
            )}
          </div>

          <div className="text-sm text-stone-600 font-medium italic leading-relaxed mb-10 border-l-4 border-stone-100 pl-6 font-sans">
            {product.shortDescription || product.description?.substring(0, 150)}
          </div>

          {/* Variants */}
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-5 font-sans">Select Weight</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants?.map(v => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-8 py-3 rounded-xl text-[11px] font-bold transition-all border font-sans ${selectedVariant?._id === v._id
                      ? 'bg-[#331917] border-[#331917] text-white shadow-xl scale-105'
                      : 'bg-white border-stone-200 text-stone-400'
                    }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-8 mb-10">
            <div className="flex items-center gap-6 bg-stone-50 p-2 rounded-xl border border-stone-200 w-fit">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center text-stone-400"><span className="material-symbols-outlined text-sm">remove</span></button>
              <span className="text-sm font-bold text-primary font-sans">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center text-stone-400"><span className="material-symbols-outlined text-sm">add</span></button>
            </div>
            {(selectedVariant?.stockQty > 0 || product.totalStock > 0) ? (
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2 font-sans">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> In Stock
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest font-sans">Out of Stock</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <button onClick={() => addToCart(product, selectedVariant, qty)} className="bg-[#331917] text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Add to Cart</button>
            <button onClick={handleBuyNow} className="bg-[#D4A017] text-white py-6 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">Buy Now</button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-10 py-10 border-t border-b border-stone-100 mb-10">
            {[
              { icon: "eco", text: "100% Natural" },
              { icon: "block", text: "No Preservatives" },
              { icon: "verified", text: "Hygienically Packed" },
              { icon: "workspace_premium", text: "Premium Quality" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#D4A017] text-lg">{f.icon}</span>
                <span className="text-xs font-bold text-stone-600 italic font-sans">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="mb-10">
            <h3 className="text-xs font-bold text-primary italic mb-4 uppercase tracking-widest font-sans">The Story</h3>
            <p className="text-sm text-stone-500 leading-relaxed font-sans">{product.description}</p>
          </div>
        </div>
      </div>

      {/* 🌟 Reviews Section */}
      <div className="border-t border-stone-100 pt-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Submission Form */}
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-serif font-black text-primary italic mb-4">Patron Thoughts</h2>
            <p className="text-sm text-stone-400 font-medium italic mb-10 font-sans">Share your experience with this artisan creation.</p>
            
            <form onSubmit={handleSubmitReview} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
                <div className="mb-6">
                    <label className="text-[10px] font-black uppercase text-stone-400 mb-3 block font-sans">Your Rating</label>
                    <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={`material-symbols-outlined text-2xl ${star <= reviewForm.rating ? 'text-[#D4A017] fill-1' : 'text-stone-200'}`}>star_rate</button>
                    ))}
                    </div>
                </div>
                <div className="mb-8">
                    <label className="text-[10px] font-black uppercase text-stone-400 mb-3 block font-sans">Review Content</label>
                    <textarea required value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Tell us what you loved..." className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-5 text-sm outline-none focus:ring-1 focus:ring-primary min-h-[120px]" />
                </div>
                <button disabled={submittingReview} className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 disabled:opacity-50">{submittingReview ? 'Submitting...' : 'Post Review'}</button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-10 border-b border-stone-100 pb-6">
              <h3 className="text-xl font-black text-primary uppercase tracking-widest font-sans">Verified Reviews</h3>
            </div>

            <div className="space-y-10">
              {product.reviews?.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="border-b border-stone-50 pb-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center font-black text-primary text-xs font-sans">{rev.userId?.name?.charAt(0) || 'D'}</div>
                        <div>
                          <h4 className="text-xs font-black text-primary uppercase tracking-widest font-sans mb-1">{rev.userId?.name || 'Anonymous'}</h4>
                          <span className="text-[9px] font-bold text-stone-300 uppercase italic font-sans">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, si) => (
                          <span key={si} className={`material-symbols-outlined text-xs ${si < rev.rating ? 'text-[#D4A017] fill-1' : 'text-stone-200'}`}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed font-medium italic ml-14 font-sans">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-100">
                  <p className="text-stone-400 font-bold italic uppercase text-xs tracking-widest font-sans">No verified reviews yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
