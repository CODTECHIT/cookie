import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useSite } from '../context/SiteContext';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';


const Home = () => {
  const { categories, settings } = useSite();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const heroBanners = banners.filter(b => b.position === 'hero');
  const middleBanners = banners.filter(b => b.position === 'middle');
  const bottomBanners = banners.filter(b => b.position === 'bottom');

  const defaultSlides = [
    { imageUrl: '/assets/home-hero-cinematic.png', title: 'Artisanal Handcrafted Cookies', subtitle: 'DAKSHA • Freshly Baked Every Day' },
    { imageUrl: '/assets/modern-display.png', title: 'Modern Display Collection', subtitle: 'Curated Artisan Excellence' },
    { imageUrl: '/assets/heritage-kitchen.png', title: 'Heritage Kitchen Recipes', subtitle: 'Traditional Flavors Since Generations' },
    { imageUrl: '/assets/millet-powder.png', title: 'Premium Millet Powders', subtitle: 'Natural & Nutrient Rich Goodness' },
    { imageUrl: '/assets/premium-packaging.png', title: 'Premium Gift Packaging', subtitle: 'Deliver Love in Every Box' }
  ];

  const activeSlides = heroBanners.length > 0 ? heroBanners : defaultSlides;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(`${API_URL}/reports/best-sellers?limit=12`);
        if (prodRes.data.success) setBestSellers(prodRes.data.data);

        const prodAllRes = await axios.get(`${API_URL}/products`);
        if (prodAllRes.data.success) {
          const allProds = prodAllRes.data.data?.products || prodAllRes.data.products || prodAllRes.data.data || [];
          const featured = Array.isArray(allProds) ? allProds.filter(p => p.isFeatured === true) : [];
          setFeaturedProducts(featured.slice(0, 10));
        }

        const bannerRes = await axios.get(`${API_URL}/content/banners`);
        if (bannerRes.data.success) {
          const activeBanners = bannerRes.data.data.filter(b => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
          setBanners(activeBanners);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [API_URL]);

  useEffect(() => {
    if (activeSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % activeSlides.length);

  const handleBuyNow = (prod, variant) => {
    addToCart(prod, variant, 1);
    navigate('/cart');
  };


  return (
    <div className="bg-background min-h-screen pb-20 lg:pb-0">
      <SEO 
        title="Artisanal Cookies & Healthy Millet Powders"
        description="Discover the authentic taste of Daksha Food Artisan. Handcrafted cashew cookies, nutrient-rich millets, and traditional snacks."
      />

      <section className="lg:hidden pt-36 pb-10 space-y-6">
        <div className="flex gap-4 px-4 overflow-x-auto hide-scrollbar py-2">
          {categories.map(cat => <MobileCategory key={cat._id} label={cat.name} to={`/category/${cat.slug || cat._id}`} src={cat.image} />)}
        </div>
        <div className="px-4">
          <div className="aspect-[16/9] w-full bg-primary rounded-3xl overflow-hidden relative shadow-2xl">
            {activeSlides.map((slide, i) => <img key={i} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentSlide ? 'opacity-60' : 'opacity-0'}`} src={slide.imageUrl || slide.src} alt="" />)}
            <div className="absolute inset-0 p-5 flex flex-col justify-center z-10 text-white">
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl max-w-[85%]">
                <p className="text-yellow-300 text-[10px] uppercase font-black tracking-widest mb-2">{activeSlides[currentSlide]?.subtitle || "Freshly Baked"}</p>
                <h2 className="text-2xl font-serif font-black italic leading-tight mb-4">{activeSlides[currentSlide]?.title || "Pure. Natural."}</h2>
                <Link to="/products" className="bg-yellow-300 text-primary w-fit px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block shadow-lg">Explore All</Link>
              </div>
            </div>
          </div>
        </div>
        {featuredProducts.length > 0 && (
          <section className="py-4 bg-white relative overflow-hidden">
            <div className="flex flex-col items-center text-center mb-6 px-4">
              <span className="text-secondary font-black uppercase tracking-[0.3em] text-[8px] mb-1 block">Special Selection</span>
              <h2 className="text-xl font-serif font-black text-primary italic leading-tight">Featured Treasures</h2>
            </div>
            <MarqueeCarousel duration={25} gap="gap-6 px-6"><div className="flex gap-6">{[...featuredProducts, ...featuredProducts].map((prod, i) => <div key={`${prod._id}-${i}`} className="min-w-[140px]"><RoundProductCard p={prod} onBuy={() => handleBuyNow(prod, prod.variants?.[0])} /></div>)}</div></MarqueeCarousel>
          </section>
        )}
        <section className="px-4 space-y-4">
          <h3 className="text-primary font-black uppercase text-xs tracking-widest">Best Sellers</h3>
          <div className="grid grid-cols-2 gap-4">
            {bestSellers.map(prod => <MobileProductCard key={prod._id} p={prod} onAdd={() => addToCart(prod, prod.variants?.[0])} onBuy={() => handleBuyNow(prod, prod.variants?.[0])} />)}
          </div>
        </section>
      </section>

      <main className="hidden lg:block">
        <section className="relative overflow-hidden h-[65vh] xl:h-[75vh] flex items-center group pt-20">
          <div className="absolute inset-0 z-0">
            {activeSlides.map((slide, i) => <img key={i} src={slide.imageUrl || slide.src} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`} alt="" />)}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
          </div>
          <div className="max-w-[1700px] mx-auto px-10 w-full relative z-10 text-white">
            <div className="max-w-xl bg-black/30 backdrop-blur-xl rounded-2xl p-10 border border-white/10 shadow-2xl">
              <span className="text-yellow-300 font-black uppercase tracking-widest text-[9px] mb-3 block">{activeSlides[currentSlide]?.subtitle || "DAKSHA • Artisanal Excellence"}</span>
              <h1 className="text-4xl xl:text-5xl font-serif font-black italic mb-4 leading-tight">{activeSlides[currentSlide]?.title || "Pure. Natural. Delicious."}</h1>
              <Link to="/products" className="bg-yellow-300 text-primary px-8 py-3 rounded-xl font-black text-xs shadow-xl uppercase tracking-widest inline-flex items-center gap-2 hover:scale-105 transition-all">Shop Collection <span className="material-symbols-outlined text-sm">arrow_right_alt</span></Link>
            </div>
          </div>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><span className="material-symbols-outlined">chevron_left</span></button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"><span className="material-symbols-outlined">chevron_right</span></button>
        </section>

        <section className="py-4 bg-white border-b border-primary/5">
          <div className="max-w-[1700px] mx-auto px-10 flex items-center justify-center gap-8">
            {categories.map(cat => <DesktopCategory key={cat._id} label={cat.name} to={`/category/${cat.slug || cat._id}`} src={cat.image} />)}
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="py-12 bg-surface-container-lowest relative overflow-hidden">
            <div className="max-w-[1700px] mx-auto px-10">
              <div className="text-center mb-8">
                <span className="text-secondary font-black uppercase tracking-[0.5rem] text-[9px] mb-3 block">Master's Selection</span>
                <h2 className="text-3xl font-serif font-black text-primary italic mb-2 tracking-tight">Featured Treasures</h2>
                <div className="w-12 h-0.5 bg-tertiary/20 mx-auto"></div>
              </div>
              <MarqueeCarousel duration={50} gap="gap-8 px-4">
                <div className="flex gap-8 px-4">
                  {[...featuredProducts, ...featuredProducts].map((prod, i) => (
                    <div key={`${prod._id}-${i}`} className="min-w-[180px]">
                      <RoundProductCard p={prod} onBuy={() => handleBuyNow(prod, prod.variants?.[0])} />
                    </div>
                  ))}
                </div>
              </MarqueeCarousel>
            </div>
          </section>
        )}

        {middleBanners.length > 0 && (
          <section className="py-6 px-10">
            <div className="max-w-[1700px] mx-auto grid grid-cols-2 gap-6">
              {middleBanners.map(b => (
                <Link to={b.linkUrl || "/products"} key={b._id} className="relative aspect-[25/9] rounded-3xl overflow-hidden shadow-xl group">
                  <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="" />
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 text-white">
                    <h3 className="text-2xl font-serif font-black italic mb-1">{b.title}</h3>
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em]">{b.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="py-12 bg-stone-50 border-t border-primary/5">
          <div className="max-w-[1700px] mx-auto px-10">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-secondary font-black uppercase tracking-widest text-[11px] mb-3 block">Shop Our Artisan Picks</span>
                <h2 className="text-3xl font-serif font-black text-primary italic">The Best Sellers</h2>
              </div>
              <Link to="/products" className="text-tertiary font-black uppercase text-xs border-b border-tertiary/20 pb-0.5 hover:text-primary hover:border-primary transition-all flex items-center gap-1.5">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
            </div>
            <div className="grid grid-cols-5 gap-6">
              {bestSellers.map(prod => (
                <DesktopProductCard key={prod._id} p={prod} onAdd={() => addToCart(prod, prod.variants?.[0])} onBuy={() => handleBuyNow(prod, prod.variants?.[0])} />
              ))}
            </div>
          </div>
        </section>

        {(!settings || settings?.shippingBanner?.enabled !== false) && (
          <section className="px-10 py-10">
            <div className="max-w-[1700px] mx-auto bg-primary rounded-[2rem] p-10 flex items-center justify-between shadow-xl relative overflow-hidden text-white">
              <div className="flex items-center gap-8 z-10">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl">local_shipping</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-black italic mb-1">{settings?.shippingBanner?.title || "Free Global Shipping."}</h2>
                  <p className="text-sm text-white/60 font-sans uppercase tracking-[0.2em]">{settings?.shippingBanner?.subtitle || "Orders above ₹999 enjoy complimentary delivery"}</p>
                </div>
              </div>
              <Link to="/products" className="bg-white text-primary px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:translate-y-[-2px] transition-all z-10">Shop Now</Link>
              <div className="absolute right-[-10%] top-[-50%] w-[500px] h-[500px] bg-tertiary opacity-10 rounded-full blur-[100px]"></div>
            </div>
          </section>
        )}

        <section className="py-12 bg-surface-container-low overflow-hidden relative">
          <div className="max-w-[1700px] mx-auto px-10">
             <div className="text-center mb-10">
                <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Expertise</span>
                <h2 className="text-3xl font-serif font-black text-primary italic mb-4">Services We Provide</h2>
             </div>
             <div className="grid grid-cols-3 gap-6 px-10 mb-12">
                <ServiceCard icon="cookie" title="Artisan Cookies" desc="Crafted with premium ingredients for a rich, traditional taste." />
                <ServiceCard icon="eco" title="Healthy Millets" desc="Finely processed, hygienic millet powders for natural living." />
                <ServiceCard icon="inventory_2" title="Bulk Supply" desc="Reliable large-scale supply with customized packaging assurance." />
             </div>

             <div className="grid grid-cols-3 gap-6 px-10">
                {bottomBanners.map(b => (
                  <Link to={b.linkUrl || "/products"} key={b._id} className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-xl border border-white/10">
                    <img src={b.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt="" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
                      <h3 className="text-xl font-serif font-black italic mb-1">{b.title}</h3>
                      <p className="text-[9px] uppercase font-bold tracking-[0.2em]">{b.subtitle}</p>
                    </div>
                  </Link>
                ))}
             </div>
          </div>
        </section>

        <section className="py-16 bg-surface relative overflow-hidden">
          <div className="max-w-[1700px] mx-auto px-10">
             <h2 className="text-center text-3xl font-serif font-black text-primary mb-12 italic">Patron Stories</h2>
             <div className="grid grid-cols-3 gap-8">
                <TestimonialCard name="Arjun Reddy" quote="The Cashew Cookies are divine. You can tell they use real butter." loc="Hyderabad" />
                <TestimonialCard name="Lakshmi Prasanna" quote="Daksha's Ragi Malt was the best health decision. Exceptional taste." loc="Vizag" dark />
                <TestimonialCard name="Karthik S." quote="The Gift Bundles are my go-to for Diwali. Premium packaging." loc="Bangalore" />
             </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* Sub-Components */
const MobileCategory = ({ label, src, to }) => (
  <Link to={to} className="flex flex-col items-center gap-1 shrink-0 min-w-[64px]">
    <div className="w-14 h-14 rounded-full border border-primary/5 bg-white shadow-md p-0.5 overflow-hidden"><img src={src} className="w-full h-full object-cover rounded-full" alt={label} /></div>
    <span className="text-[9px] font-black uppercase text-primary opacity-80">{label}</span>
  </Link>
);

const DesktopCategory = ({ label, src, to }) => (
  <Link to={to} className="flex flex-col items-center gap-2 group hover:translate-y-[-4px] transition-all">
    <div className="w-20 h-20 rounded-full border border-primary/5 bg-white shadow-md p-1 group-hover:border-tertiary transition-colors">
      <img src={src} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform" alt={label} />
    </div>
    <span className="text-[10px] font-black uppercase text-primary tracking-widest">{label}</span>
  </Link>
);

const MobileProductCard = ({ p, onAdd, onBuy }) => (
  <div className="bg-white rounded-xl p-2.5 shadow-md flex flex-col group h-full border border-primary/5">
    <Link to={`/product/${p.slug || p._id}`} className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-stone-50 block">
      <img src={p.images?.[0]?.url} className="w-full h-full object-cover" alt={p.name} />
    </Link>
    <div className="flex-1 flex flex-col px-1">
      <h4 className="font-serif font-black italic text-xs text-primary line-clamp-1 h-4">{p.name}</h4>
      <p className="font-serif font-black text-base text-tertiary italic mt-1 leading-none">₹{p.variants?.[0]?.price}</p>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
      <button onClick={onAdd} className="bg-primary text-white py-2 rounded-lg font-black text-[7px] uppercase tracking-widest">Add</button>
      <button onClick={onBuy} className="bg-tertiary text-white py-2 rounded-lg font-black text-[7px] uppercase tracking-widest">Buy</button>
    </div>
  </div>
);

const DesktopProductCard = ({ p, onAdd, onBuy }) => (
  <div className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center h-full border border-primary/5">
    <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 relative block bg-stone-50">
      <Link to={`/product/${p.slug || p._id}`}>
        <img src={p.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" alt={p.name} />
      </Link>
      <div className="absolute bottom-3 left-3 right-3 flex gap-2 z-20">
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-black text-[9px] uppercase shadow-lg hover:bg-black transition-all">Add</button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBuy(); }} className="flex-1 bg-tertiary text-white py-2.5 rounded-xl font-black text-[9px] uppercase shadow-lg hover:opacity-90 transition-all">Buy Now</button>
      </div>
    </div>
    <h3 className="font-serif text-lg font-black text-primary italic mb-1 line-clamp-1 h-6">{p.name}</h3>
    <span className="font-serif text-xl font-black text-tertiary italic mt-auto">₹{p.variants?.[0]?.price}</span>
  </div>
);

const RoundProductCard = ({ p, onBuy }) => (
  <div className="flex flex-col items-center group transition-all text-center">
    <div className="relative mb-4 block group-hover:scale-105 transition-transform duration-500">
      <Link to={`/product/${p.slug || p._id}`}>
        <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-[2rem] overflow-hidden border border-stone-100 shadow-xl bg-white">
          <img src={p.images?.[0]?.url} className="w-full h-full object-cover" alt={p.name} />
        </div>
      </Link>
      <button onClick={onBuy} className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex items-center justify-center backdrop-blur-[2px]">
        <span className="text-white font-black text-[9px] uppercase tracking-widest bg-primary/80 px-4 py-2 rounded-full">Buy</span>
      </button>
    </div>
    <h3 className="text-xs font-serif font-black text-primary italic leading-tight uppercase tracking-tight line-clamp-2 px-3 max-w-[150px] group-hover:text-tertiary transition-colors">{p.name}</h3>
  </div>
);

const ServiceCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-white rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-xl transition-all h-full group text-left">
    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <h4 className="font-serif font-black text-xl text-primary mb-2 italic">{title}</h4>
    <p className="text-stone-500 text-sm leading-relaxed font-sans italic">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, quote, loc, dark }) => (
  <div className={`p-6 rounded-[2rem] relative shadow-lg transition-all hover:translate-y-[-4px] ${dark ? 'bg-primary text-white' : 'bg-white text-primary border border-primary/5'}`}>
    <span className="material-symbols-outlined text-5xl absolute top-4 right-4 opacity-10">format_quote</span>
    <p className="text-lg italic font-serif leading-relaxed mb-5 font-bold relative z-10">"{quote}"</p>
    <div>
      <h4 className="font-black text-sm uppercase tracking-widest mb-1">{name}</h4>
      <p className="text-[10px] uppercase font-black tracking-widest opacity-60 italic">{loc}</p>
    </div>
  </div>
);

const MarqueeCarousel = ({ children, duration = 30, gap = 'gap-4 xl:gap-10', className = '' }) => {
  return (
    <div className={`marquee-container ${className}`}>
      <div className={`marquee-track ${gap} animate-marquee`} style={{ '--marquee-duration': `${duration}s` }}>
        {children}
      </div>
    </div>
  );
};

export default Home;
