import React, { useState, useMemo } from 'react';
import FlipkartCard from '../components/FlipkartCard';
import { Link } from 'react-router-dom';

const FilterContent = ({ 
  selectedCategories, 
  toggleCategory, 
  priceRange, 
  setPriceRange, 
  setSelectedCategories, 
  selectedWeight, 
  setSelectedWeight,
  onApply
}) => (
  <div className="bg-[#F8F5F0] lg:rounded-3xl p-8 lg:border border-stone-100 h-full overflow-y-auto flex flex-col">
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-lg font-bold text-primary italic">Filters</h2>
      <button 
        onClick={() => { setSelectedCategories([]); setPriceRange(1000); }}
        className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest border-b border-[#D4A017]/20"
      >
        Clear All
      </button>
    </div>

    {/* Category */}
    <div className="mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-6 font-sans">Category</h3>
      <div className="space-y-4">
        {['Cashew', 'Millet', 'Chocolate', 'Almond'].map(cat => (
          <label key={cat} className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={selectedCategories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary appearance-none border checked:bg-primary checked:border-primary transition-all relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:text-[10px] after:opacity-0 checked:after:opacity-100" 
            />
            <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat) ? 'text-primary' : 'text-stone-600 group-hover:text-primary'}`}>{cat}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div className="mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-6 font-sans">Price Range</h3>
      <input 
        type="range" 
        min="0" 
        max="1000" 
        step="50"
        value={priceRange} 
        onChange={(e) => setPriceRange(parseInt(e.target.value))}
        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#331917]"
      />
      <div className="flex justify-between mt-4 text-[11px] font-bold text-stone-500 font-sans">
        <span>₹0</span>
        <span>₹{priceRange}</span>
      </div>
    </div>

    {/* Weight */}
    <div className="mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-6 font-sans">Weight</h3>
      <div className="grid grid-cols-2 gap-2">
        {['100g', '250g', '500g', '1kg'].map(w => (
          <button 
            key={w}
            onClick={() => setSelectedWeight(w)}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedWeight === w 
              ? 'bg-[#331917] border-[#331917] text-white shadow-xl' 
              : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'
            }`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>

    {/* Mobile Footer (Drawer Apply) */}
    {onApply && (
      <div className="lg:hidden mt-auto pt-6">
        <button onClick={onApply} className="w-full py-5 bg-[#331917] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl active:scale-95 transition-all shadow-xl">
           Apply Filters
        </button>
      </div>
    )}
  </div>
);

const Cookies = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('Relevance');
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState(['Millet']);
  const [selectedWeight, setSelectedWeight] = useState('250g');

  const products = useMemo(() => [
    { id: 1, title: "Classic Ragi & Dark Choco", price: 249, oldPrice: 350, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Millet", tagline: "Handcrafted", weight: "250g" },
    { id: 2, title: "Roasted Almond Millet Crunch", price: 299, oldPrice: 399, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Almond", tagline: "Sugar Free", weight: "250g" },
    { id: 3, title: "Golden Cashew Shortbread", price: 549, oldPrice: 650, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cashew", tagline: "Jaggery Based", weight: "500g" },
    { id: 4, title: "Multi-Millet Super Oats", price: 199, oldPrice: 299, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Millet", tagline: "Fiber Rich", weight: "250g" },
    { id: 5, title: "Oreo & Cream Dream", price: 239, oldPrice: 249, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Chocolate", tagline: "Indulgent", weight: "250g" },
    { id: 6, title: "Red Velvet Velvet", price: 399, oldPrice: 499, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPdbZUlTB6wmNtrSPurHGyNwF2jkn9XnfHs_BLTISeDqQWTTSCH3mmiAUq_xSPBvhyKeQ7h9oEE1WUk_mC_m1LD-ss8tWlnKCxPIYLIg8zE2rs91BhMe63dyIYow60y8NuFihlVu2WIap4-2_CC1GFLQUEv6LAg7LiXoYqBFX7JzCmIfPYcZLlmAnR8-tuiW4y6wcra67a6dEIxR7agJriiVDTKypogRQwiXFxcRhbB9t_GsbO8r8uTdp56lAxPZTSw2l5jonKQPY", category: "Cashew", tagline: "Premium", weight: "250g" },
  ], []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.price <= priceRange);
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (sortBy === 'Price: Low to High') result.sort((a,b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a,b) => b.price - a.price);
    return result;
  }, [products, priceRange, selectedCategories, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="pt-16 lg:pt-32 pb-20 px-4 xl:px-10 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
      {/* Mobile Sticky Bar (Flipkart Style) */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100] flex bg-[#331917]/90 backdrop-blur-xl text-white rounded-3xl shadow-[0_20px_50px_rgba(51,25,23,0.3)] overflow-hidden border border-white/10">
         <button onClick={() => setShowFilters(true)} className="flex-1 py-5 flex items-center justify-center gap-3 border-r border-white/10 active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            <span className="text-[11px] font-black uppercase tracking-widest">Filters</span>
         </button>
         <div className="flex-1 py-5 flex items-center justify-center gap-3 group relative active:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-lg">sort</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            >
              <option>Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
            <span className="text-[11px] font-black uppercase tracking-widest">Sort</span>
         </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilters ? 'visible' : 'invisible'}`}>
         <div className={`absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-500 ${showFilters ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowFilters(false)}></div>
         <div className={`absolute left-0 right-0 bottom-0 bg-[#FDFBF7] rounded-t-[3rem] h-[85vh] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilters ? 'translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]' : 'translate-y-full'}`}>
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto my-6"></div>
            <FilterContent 
               selectedCategories={selectedCategories}
               toggleCategory={toggleCategory}
               priceRange={priceRange}
               setPriceRange={setPriceRange}
               setSelectedCategories={setSelectedCategories}
               selectedWeight={selectedWeight}
               setSelectedWeight={setSelectedWeight}
               onApply={() => setShowFilters(false)}
            />
         </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs text-stone-300">chevron_right</span>
        <span className="text-stone-900">Health & Heritage Cookies</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32">
            <FilterContent 
               selectedCategories={selectedCategories}
               toggleCategory={toggleCategory}
               priceRange={priceRange}
               setPriceRange={setPriceRange}
               setSelectedCategories={setSelectedCategories}
               selectedWeight={selectedWeight}
               setSelectedWeight={setSelectedWeight}
            />
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-grow">
          {/* Header Info (Desktop) */}
          <div className="hidden lg:flex bg-[#F8F5F0] rounded-2xl p-6 mb-10 justify-between items-center border border-stone-100">
            <p className="text-sm font-medium text-stone-500 italic">
              Found <span className="font-bold text-primary not-italic">{filteredProducts.length}</span> artisanal masterpieces
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Sort By:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-8 md:gap-y-12">
            {filteredProducts.map(p => (
               <FlipkartCard key={p.id} p={p} category="cookies" />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-32 animate-fade-in">
               <span className="material-symbols-outlined text-7xl text-stone-200 mb-6 font-thin">cookie_off</span>
               <h3 className="text-xl font-serif italic text-primary mb-2">No cookies found</h3>
               <p className="text-sm text-stone-400 font-medium tracking-wide">Try adjusting your filters to discover our other treats.</p>
               <button onClick={() => { setSelectedCategories([]); setPriceRange(1000); }} className="mt-8 text-[11px] font-black uppercase tracking-widest text-[#D4A017] border-b border-[#D4A017]/20">Reset all filters</button>
            </div>
          )}

          {/* Pagination (Desktop) */}
          {filteredProducts.length > 0 && (
            <div className="mt-24 flex justify-center items-center gap-3">
              <button className="w-12 h-12 rounded-2xl border border-stone-100 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xl shadow-primary/20">1</button>
              <button className="w-12 h-12 rounded-2xl border border-stone-100 flex items-center justify-center font-bold text-sm hover:bg-white hover:shadow-xl transition-all text-stone-400">2</button>
              <button className="w-12 h-12 rounded-2xl border border-stone-100 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all text-stone-400"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Cookies;


