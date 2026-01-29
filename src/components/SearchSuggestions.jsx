// src/components/SearchSuggestions.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SearchSuggestions({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = "Search products..." 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [term, ...saved.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value.trim() || value.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/admin", {
          params: { search: value, limit: 5 },
        });
        setSuggestions(res.data.products || []);
      } catch (err) {
        console.error("Search suggestions error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    saveRecentSearch(product.name);
    navigate(`/products/${product._id}`);
    setShowSuggestions(false);
    onChange("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      saveRecentSearch(value);
      onSubmit?.(e);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    onChange("");
    setSuggestions([]);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-500 focus:outline-none bg-white shadow-md transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (value.length >= 2 || (!value && recentSearches.length > 0)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-pink-100 overflow-hidden z-50">
          {/* Recent Searches */}
          {!value && recentSearches.length > 0 && (
            <div className="p-3 border-b border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} />
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-pink-500 hover:text-pink-700"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onChange(term);
                      setShowSuggestions(false);
                    }}
                    className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm hover:bg-pink-100 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center">
              <div className="inline-block w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Product Suggestions */}
          {!loading && suggestions.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              <div className="px-3 py-2 bg-pink-50/50">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={12} />
                  Products
                </span>
              </div>
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSelect(product)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-pink-50 transition text-left"
                >
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-pink-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm text-pink-600">Rs.{product.finalPrice || product.price}</p>
                  </div>
                </button>
              ))}
              
              {/* Search All Results */}
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-center text-pink-600 font-medium hover:bg-pink-50 transition border-t border-pink-100"
              >
                See all results for "{value}"
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && value.length >= 2 && suggestions.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-pink-200" />
              <p>No products found for "{value}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
