// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Wishlist({ wishlist, removeFromWishlist, addToCart }) {
  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    toast.success("Moved to cart!");
  };

  const handleRemove = (productId, productName) => {
    removeFromWishlist(productId);
    toast.success(`${productName} removed from wishlist`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-md">
          <div className="w-16 sm:w-24 h-16 sm:h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Heart className="w-8 h-12 text-pink-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Save items you love to your wishlist and find them easily anytime.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition text-sm sm:text-base"
          >
            <ShoppingCart size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8 sm:py-12 px-3 sm:px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <Heart className="text-pink-500 w-6 h-6 sm:w-8 sm:h-8" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">{wishlist.length} items saved</p>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm sm:text-base"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
            >
              {/* Image */}
              <Link to={`/products/${product._id}`} className="block relative">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                {product.isDiscountActive && (
                  <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </Link>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-pink-600 transition text-sm sm:text-base">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="text-base sm:text-lg font-bold text-pink-600">
                    Rs.{(product.finalPrice || product.price)?.toFixed(2)}
                  </span>
                  {product.isDiscountActive && product.price && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      Rs.{product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-pink-500 hover:bg-pink-600 text-white py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition text-xs sm:text-sm"
                  >
                    <ShoppingCart size={14} />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center border-2 border-red-200 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
