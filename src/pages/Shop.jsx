// src/pages/Shop.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchSuggestions from "../components/SearchSuggestions";
import { Grid, List, ArrowUpDown, Filter, X, Package, Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

export default function Shop({ addToCart, addToWishlist, removeFromWishlist, isInWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const categoryDropdownRef = useRef(null);

  const searchRef = useRef(null);
  const toolbarRef = useRef(null);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);

  // Get category info from URL
  const categoryFromUrl = searchParams.get("category");
  
  // Category headers with custom titles and images
  const categoryInfo = useMemo(() => {
    const categoryMap = {
      'Cash Bouquets': { title: 'Cash Bouquets', emoji: '💰', desc: 'Unique cash gift bouquets for special occasions', color: '#10b981' },
      'Makeup & Skincare': { title: 'Makeup & Skincare', emoji: '💄', desc: 'Beauty hampers and makeup bouquets', color: '#ec4899' },
      'Chocolates': { title: 'Chocolates & Snacks', emoji: '🍫', desc: 'Sweet treats and chocolate gifts', color: '#8b5cf6' },
      'Flowers': { title: 'Flower Bouquets', emoji: '💐', desc: 'Beautiful flowers for every occasion', color: '#f59e0b' },
      'For Him': { title: 'Gifts for Him', emoji: '🎁', desc: 'Special gifts for the special man', color: '#3b82f6' },
      'For Her': { title: 'Gifts for Her', emoji: '💝', desc: 'Perfect gifts for the lovely lady', color: '#ec4899' },
      'Baby': { title: 'Baby Gifts', emoji: '👶', desc: 'Adorable hampers for little ones', color: '#f97316' },
      'Birthday': { title: 'Birthday Gifts', emoji: '🎂', desc: 'Make their day special', color: '#ef4444' },
      'Anniversary': { title: 'Anniversary Gifts', emoji: '❤️', desc: 'Celebrate love with perfect gifts', color: '#e34f4d' },
    };
    
    const key = Object.keys(categoryMap).find(k => 
      categoryFromUrl?.toLowerCase().includes(k.toLowerCase())
    );
    return key ? categoryMap[key] : null;
  }, [categoryFromUrl]);

  // Update selected category when URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
      setPage(1);
    }
  }, [searchParams]);

  // Sticky toolbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (toolbarRef.current) {
        const rect = toolbarRef.current.getBoundingClientRect();
        setIsToolbarSticky(rect.top <= 80);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(searchRef.current);
  }, [search, selectedCategory, page, sortBy, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin", {
        params: { 
          search, 
          category: selectedCategory, 
          page, 
          limit: 12, 
          sort: sortBy,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
        },
      });
      
      let filteredProducts = res.data.products || [];
      
      // Client-side sorting since API may not support all sort options
      if (sortBy === "price-low") {
        filteredProducts.sort((a, b) => (a.finalPrice || a.price || 0) - (b.finalPrice || b.price || 0));
      } else if (sortBy === "price-high") {
        filteredProducts.sort((a, b) => (b.finalPrice || b.price || 0) - (a.finalPrice || a.price || 0));
      } else if (sortBy === "newest") {
        filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      } else if (sortBy === "name-asc") {
        filteredProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      } else if (sortBy === "name-desc") {
        filteredProducts.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      }
      
      setProducts(filteredProducts);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.totalProducts || filteredProducts.length);
      setCategories(res.data.categories || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error loading products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory || priceRange.min || priceRange.max;

  // Calculate showing text
  const startItem = (page - 1) * 12 + 1;
  const endItem = Math.min(page * 12, totalProducts);

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50 min-h-screen overflow-x-hidden">
      {/* Header - Shows category info if selected */}
      <section 
        className="relative rounded-b-3xl overflow-hidden shadow-lg"
        style={{ 
          backgroundColor: categoryFromUrl ? '#fbe8ec' : '#fce7f3',
          background: categoryFromUrl 
            ? `linear-gradient(135deg, ${categoryInfo?.color}15 0%, #ffd5d8 100%)`
            : 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          {categoryFromUrl && categoryInfo ? (
            // Category-specific header
            <div className="text-center animate-fade-in">
              <div 
                className="text-5xl sm:text-6xl mb-4 inline-block"
                style={{ animation: 'bounce 2s infinite' }}
              >
                {categoryInfo.emoji}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: categoryInfo.color }}>
                {categoryInfo.title}
              </h1>
              <p className="text-center text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                {categoryInfo.desc}
              </p>
              <div className="mt-6 flex justify-center gap-2 flex-wrap">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                      selectedCategory === cat 
                        ? 'bg-[#e34f4d] text-white shadow-lg' 
                        : 'bg-white text-gray-600 hover:bg-[#e34f4d] hover:text-white shadow-md'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Default header
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center gap-2 mb-4">
                <Package className="w-8 h-8 text-[#e34f4d]" />
                <span className="text-sm font-semibold text-[#e34f4d] uppercase tracking-wider">Premium Collection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2">
                Our Lovely Collection
              </h1>
              <p className="text-center text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                Discover hand-picked items that bring joy to every occasion
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        {/* Search Bar - Prominent */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <SearchSuggestions
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onSubmit={() => fetchProducts()}
              placeholder="Search for gifts, bouquets, chocolates..."
            />
          </div>
        </div>

        {/* Toolbar - Sort, View, Filters */}
        <div 
          ref={toolbarRef}
          className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-pink-200 transition-all duration-300 ${
            isToolbarSticky ? 'sticky top-20 z-30 bg-white/95 backdrop-blur-sm py-4 px-4 -mx-4 rounded-xl shadow-sm' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-pink-300 border-t-[#e34f4d] rounded-full animate-spin"></span>
                  Loading...
                </span>
              ) : (
                <>Showing <span className="font-semibold text-gray-700">{startItem}-{endItem}</span> of <span className="font-semibold text-gray-700">{totalProducts}</span> products</>
              )}
            </span>
            
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-[#e34f4d] hover:text-[#c94543] font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-200 text-gray-700 hover:bg-pink-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-pink-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 cursor-pointer hover:border-pink-300 transition-colors"
              >
                <option value="featured">⭐ Featured</option>
                <option value="best-selling">🔥 Best Selling</option>
                <option value="newest">✨ Newest</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name-asc">📖 Name: A-Z</option>
                <option value="name-desc">📖 Name: Z-A</option>
              </select>
            </div>
            
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-pink-50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow text-[#e34f4d]" : "text-gray-400 hover:text-pink-500"}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white shadow text-[#e34f4d]" : "text-gray-400 hover:text-pink-500"}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex justify-center mb-8" ref={categoryDropdownRef}>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all hover:scale-105 ${
                selectedCategory 
                  ? 'bg-[#e34f4d] text-white shadow-lg shadow-pink-200' 
                  : 'bg-white text-gray-700 hover:bg-pink-50 shadow-md border border-pink-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{selectedCategory || 'All Categories'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-pink-100 overflow-hidden z-40 animate-fade-in">
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-white border-b border-pink-100">
                  <p className="text-sm font-semibold text-gray-700">Select Category</p>
                  <p className="text-xs text-gray-500">{categories.length} categories available</p>
                </div>
                
                {/* Scrollable List */}
                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleCategoryChange('');
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                        !selectedCategory 
                          ? 'bg-[#e34f4d] text-white shadow-md' 
                          : 'hover:bg-pink-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏪</span>
                        <span className="font-medium">All Categories</span>
                      </div>
                      {!selectedCategory && <Check className="w-5 h-5" />}
                    </button>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    {categories.map((cat, index) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategoryChange(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                          selectedCategory === cat 
                            ? 'bg-[#e34f4d] text-white shadow-md' 
                            : 'hover:bg-pink-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {index % 5 === 0 && '🎁'}
                            {index % 5 === 1 && '💝'}
                            {index % 5 === 2 && '🎀'}
                            {index % 5 === 3 && '💐'}
                            {index % 5 === 4 && '🎂'}
                          </span>
                          <span className="font-medium">{cat}</span>
                        </div>
                        {selectedCategory === cat && <Check className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-500">Scroll to see more</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
              <span className="text-4xl">😕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-2 bg-[#e34f4d] text-white rounded-full hover:bg-[#c94543] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-100 mb-6 animate-bounce">
              <Search className="w-12 h-12 text-[#e34f4d]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-3 bg-[#e34f4d] text-white rounded-full hover:bg-[#c94543] transition-all hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 max-w-3xl mx-auto"}`}>
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-full border-2 border-pink-200 bg-white text-gray-700 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                >
                  ← Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full font-semibold transition-all ${
                          page === pageNum
                            ? 'bg-[#e34f4d] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className="w-10 h-10 rounded-full font-semibold bg-white text-gray-700 hover:bg-pink-50 border border-pink-200 transition-all"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-full border-2 border-pink-200 bg-white text-gray-700 hover:bg-pink-50 hover:border-pink-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #fbcfe8;
          border-radius: 20px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #f9a8d4;
        }
      `}</style>
    </div>
  );
}