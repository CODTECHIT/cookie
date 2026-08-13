import React, { useState, useEffect, useMemo, useCallback } from "react";
import FlipkartCard from "../components/FlipkartCard";
import { Link, useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import { useSite } from "../context/SiteContext";
import SEO from "../components/SEO";
import { getSafeImageUrl } from "../utils/imageUrl";

const FilterContent = ({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  setSelectedCategories,
  selectedWeight,
  setSelectedWeight,
  onApply,
}) => (
  <div className="bg-[#F8F5F0] lg:rounded-3xl p-6 md:p-8 lg:border border-stone-100 h-full overflow-y-auto flex flex-col">
    <div className="flex justify-between items-center mb-6 md:mb-10">
      <h2 className="text-lg font-bold text-primary italic">Filters</h2>
      <button
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange(5000);
        }}
        className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest border-b border-[#D4A017]/20"
      >
        Clear All
      </button>
    </div>

    {/* Category */}
    <div className="mb-6 md:mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-4 md:mb-6 font-sans">
        Category
      </h3>
      <div className="space-y-3 md:space-y-4">
        {categories.map((cat) => (
          <label
            key={cat._id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat._id)}
              onChange={() => toggleCategory(cat._id)}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary appearance-none border checked:bg-primary checked:border-primary transition-all relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:text-[10px] after:opacity-0 checked:after:opacity-100"
            />
            <span
              className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat._id) ? "text-primary" : "text-stone-600 group-hover:text-primary"}`}
            >
              {cat.name}
            </span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div className="mb-6 md:mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-4 md:mb-6 font-sans">
        Max Price
      </h3>
      <input
        type="range"
        min="0"
        max="5000"
        step="100"
        value={priceRange}
        onChange={(e) => setPriceRange(parseInt(e.target.value))}
        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#331917]"
      />
      <div className="flex justify-between mt-3 text-[11px] font-bold text-stone-500 font-sans">
        <span>₹0</span>
        <span>₹{priceRange}</span>
      </div>
    </div>

    {/* Weight */}
    <div className="mb-6 md:mb-10">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-primary/40 mb-4 md:mb-6 font-sans">
        Weight
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {["100g", "250g", "500g", "1kg"].map((w) => (
          <button
            key={w}
            onClick={() => setSelectedWeight(w)}
            className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedWeight === w
                ? "bg-[#331917] border-[#331917] text-white shadow-xl"
                : "bg-white border-stone-100 text-stone-400 hover:border-stone-200"
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
        <button
          onClick={onApply}
          className="w-full py-4 bg-[#331917] text-white font-black uppercase tracking-widest text-[11px] rounded-2xl active:scale-95 transition-all shadow-xl"
        >
          Apply Filters
        </button>
      </div>
    )}
  </div>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const categoryId = searchParams.get("category");
  const searchTerm = searchParams.get("search");
  const { categories, API_URL } = useSite();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState("Relevance");
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCategories, setSelectedCategories] = useState(
    categorySlug || categoryId ? [categorySlug || categoryId] : [],
  );
  const [selectedWeight, setSelectedWeight] = useState("");

  // ⚡ Add pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sortOptions = [
    { label: "Relevance", value: "Relevance" },
    { label: "Price: Low to High", value: "Price: Low to High" },
    { label: "Price: High to Low", value: "Price: High to Low" },
    { label: "Newest", value: "Newest" },
  ];

  useEffect(() => {
    setSelectedCategories(
      categorySlug || categoryId ? [categorySlug || categoryId] : [],
    );
    setPage(1); // Reset page when filters change
  }, [categorySlug, categoryId]);

  const activeCategory = useMemo(() => {
    if (selectedCategories.length === 1) {
      return categories.find(
        (c) =>
          c._id === selectedCategories[0] || c.slug === selectedCategories[0],
      );
    }
    return null;
  }, [categories, selectedCategories]);

  const seoTitle = searchTerm
    ? `Search results for "${searchTerm}" | dakshacookiesmillets`
    : activeCategory?.metaTitle ||
      activeCategory?.name ||
      "Premium Cookies & Healthy Millets Collection";
  const seoDesc =
    activeCategory?.metaDescription ||
    "Browse our curated collection of artisanal handcrafted cookies, millet-based health powders, and traditional snacks. 100% organic ingredients, free shipping above ₹999.";
  const showNoIndex = activeCategory?.isIndexed === false;

  // ⚡ OPTIMIZED: Fetch with pagination and move filtering to backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/products`, {
        params: {
          category: selectedCategories.join(","),
          search: searchTerm,
          page,
          limit: 12, // Load 12 products per page
          t: Date.now(),
        },
      });
      if (data.success) {
        setProducts((prev) =>
          page === 1 ? data.data.products : [...prev, ...data.data.products],
        );
        setHasMore(page < (data.data.pages || 1));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, selectedCategories, searchTerm, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ⚡ Client-side filtering for weight and price only (minimal impact)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (result.visibleonCatalog === false)
      result = result.filter((p) => p.visibleonCatalog !== false);

    result = result.filter((p) => {
      const pMinPrice =
        p.variants?.reduce(
          (min, v) => (v.price < min ? v.price : min),
          Infinity,
        ) || 0;
      return pMinPrice <= priceRange;
    });

    if (selectedWeight) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.weight === selectedWeight),
      );
    }

    if (sortBy === "Price: Low to High") {
      result.sort(
        (a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0),
      );
    } else if (sortBy === "Price: High to Low") {
      result.sort(
        (a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0),
      );
    }
    return result;
  }, [products, priceRange, selectedWeight, sortBy]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setShowSort(false);
  };

  return (
    <div className="pt-0 lg:pt-24 pb-16 px-4 xl:px-10 max-w-[1700px] mx-auto min-h-screen bg-[#FDFBF7]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={`${activeCategory?.metaKeywords || ""}, cookies online, millet snacks, healthy food, artisanal products, Daksha cookies, buy cookies India, premium cookies, organic millets`}
        noIndex={showNoIndex}
      />

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-24 left-4 right-4 z-[100] flex bg-[#331917]/95 backdrop-blur-xl text-white rounded-3xl shadow-[0_20px_50px_rgba(51,25,23,0.3)] overflow-hidden border border-white/10">
        <button
          onClick={() => setShowFilters(true)}
          className="flex-1 py-4 flex items-center justify-center gap-2 border-r border-white/10 active:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">filter_alt</span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filters
          </span>
        </button>
        <button
          onClick={() => setShowSort(true)}
          className="flex-1 py-4 flex items-center justify-center gap-2 active:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">sort</span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Sort
          </span>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilters ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-500 ${showFilters ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowFilters(false)}
        ></div>
        <div
          className={`absolute left-0 right-0 bottom-0 bg-[#FDFBF7] rounded-t-[2.5rem] h-[80vh] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilters ? "translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]" : "translate-y-full"}`}
        >
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto my-4"></div>
          <div className="h-full overflow-y-auto pb-20">
            <FilterContent
              categories={categories}
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
      </div>

      {/* Mobile Sort Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showSort ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity duration-500 ${showSort ? "opacity-100" : "opacity-0"}`}
          onClick={() => setShowSort(false)}
        ></div>
        <div
          className={`absolute left-0 right-0 bottom-0 bg-[#FDFBF7] rounded-t-[2.5rem] p-8 pb-12 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showSort ? "translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.2)]" : "translate-y-full"}`}
        >
          <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto -mt-4 mb-6"></div>
          <h2 className="text-xl font-serif font-black text-primary italic mb-6">
            Sort By
          </h2>
          <div className="space-y-2">
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`w-full text-left py-4 px-6 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${sortBy === opt.value ? "bg-primary text-white shadow-xl translate-x-1" : "bg-white text-primary border border-stone-100 italic"}`}
              >
                {opt.label}
                {sortBy === opt.value && (
                  <span className="material-symbols-outlined text-sm">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSort(false)}
            className="w-full mt-6 py-2 text-[10px] font-black uppercase text-stone-400"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-xs text-stone-300">
          chevron_right
        </span>
        <span className="text-stone-900">
          {activeCategory?.name || "Health & Heritage Collection"}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32">
            <FilterContent
              categories={categories}
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

        <main className="flex-grow">
          {/* Header Info Desktop */}
          <div className="hidden lg:flex bg-[#F8F5F0] rounded-2xl p-4 mb-6 justify-between items-center border border-stone-100">
            <p className="text-sm font-medium text-stone-500 italic">
              Found{" "}
              <span className="font-bold text-primary not-italic">
                {filteredProducts.length}
              </span>{" "}
              masterpieces
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value}>{o.value}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-6">
            {filteredProducts.map((p) => (
              <FlipkartCard
                key={p._id}
                p={{
                  id: p._id,
                  slug: p.slug,
                  title: p.name,
                  price: p.variants?.[0]?.price || 0,
                  oldPrice: p.variants?.[0]?.originalPrice || 0,
                  img: getSafeImageUrl(
                    p.images?.find((i) => i.isMain)?.url || p.images?.[0]?.url,
                  ),
                  tagline: p.shortDescription || "Artisanal",
                  rating: p.avgRating,
                  reviews: p.reviewCount,
                }}
              />
            ))}
          </div>

          {/* ⚡ Load More Button for Pagination */}
          {!loading && hasMore && filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setPage(page + 1)}
                className="bg-primary text-secondary-fixed px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:shadow-3xl transition-all active:scale-95"
              >
                Load More Products
              </button>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-24 xl:py-40 bg-white/50 rounded-[3rem] border border-stone-100/50 backdrop-blur-sm">
              <h3 className="text-2xl xl:text-4xl font-serif italic text-primary mb-4">
                {searchTerm
                  ? `The item "${searchTerm}" is not available`
                  : "Our artisanal oven is warming up..."}
              </h3>
              <p className="text-sm xl:text-base text-stone-400 font-medium mb-12">
                Try browsing our entire collection below.
              </p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange(5000);
                  setPage(1);
                }}
                className="bg-primary text-secondary-fixed px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all"
              >
                Explore Collections
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
