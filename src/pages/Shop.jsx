// src/pages/Shop.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Shop({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch products
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delay);
  }, [search, selectedCategory, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: { search, category: selectedCategory, page, limit: 8 },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
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

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            className={`px-5 py-2 rounded-full border-2 transition-all ${
              selectedCategory === ""
                ? "bg-pink-500 text-white border-pink-500 shadow-md scale-105"
                : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
            }`}
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full border-2 transition-all ${
                selectedCategory === cat
                  ? "bg-pink-500 text-white border-pink-500 shadow-md scale-105"
                  : "bg-white text-pink-600 border-pink-300 hover:bg-pink-100"
              }`}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <p className="text-center text-pink-500 animate-pulse">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} addToCart={addToCart} />
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
