// src/pages/Shop.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search, ChevronDown, X } from "lucide-react";

export default function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(searchRef.current);
  }, [search, selectedCategory, page]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin", {
        params: { search, category: selectedCategory, page, limit: 8 },
      });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setCategories(res.data.categories || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error loading products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50 min-h-screen">
      {/* Header */}
      <section className="relative bg-pink-100 rounded-b-3xl overflow-hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
            🌸 Our Lovely Collection 🌸
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Discover hand-picked items that bring joy to every occasion.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute top-3 left-3 text-pink-400" />
            <input
              type="text"
              placeholder="Search beautiful products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-md"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Premium Category Dropdown */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="group flex items-center gap-3 bg-white px-6 py-3 rounded-xl border-2 border-pink-200 shadow-lg hover:shadow-xl hover:border-pink-400 transition-all duration-300 min-w-[220px]"
            >
              <span className="flex-1 text-left">
                <span className="text-xs text-pink-400 font-medium uppercase tracking-wider block mb-0.5">
                  Category
                </span>
                <span className="text-pink-700 font-semibold text-lg">
                  {selectedCategory || "All Products"}
                </span>
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-pink-500 transition-transform duration-300 ${
                  isCategoryOpen ? "rotate-180" : ""
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-pink-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* All Products Option */}
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setPage(1);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full px-5 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                    selectedCategory === ""
                      ? "bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border-l-4 border-pink-500"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600 border-l-4 border-transparent"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  <span className="font-medium">All Products</span>
                  {selectedCategory === "" && (
                    <span className="ml-auto text-pink-500">✓</span>
                  )}
                </button>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent mx-4"></div>

                {/* Category Options */}
                {categories.map((cat, index) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setPage(1);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border-l-4 border-pink-500"
                        : "text-gray-600 hover:bg-pink-50 hover:text-pink-600 border-l-4 border-transparent"
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: `hsl(${330 + (index * 15) % 30}, 70%, 60%)`
                      }}
                    ></span>
                    <span className="font-medium">{cat}</span>
                    {selectedCategory === cat && (
                      <span className="ml-auto text-pink-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Category Badge */}
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setPage(1);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span className="text-sm font-medium">{selectedCategory}</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/90 rounded-2xl shadow-lg p-5 h-96 flex items-center justify-center"
                >
                  <div className="w-full h-full bg-gray-200 rounded-xl" />
                </div>
              ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border border-pink-300 rounded-full bg-white hover:bg-pink-100 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-pink-700 font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-pink-300 rounded-full bg-white hover:bg-pink-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
