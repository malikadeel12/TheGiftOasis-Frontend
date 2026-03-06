// src/pages/Wishlist.jsx
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles, Package } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-pink-300" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-[#e34f4d]" />
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8">
            Save items you love to your wishlist and find them easily anytime.
          </p>
          
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#e34f4d] hover:bg-[#c94543] text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8 sm:py-12 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e34f4d] to-pink-600 flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-500 text-sm">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
            </div>
          </div>
          
          <Link
            to="/shop"
            className="flex items-center gap-2 text-[#e34f4d] hover:text-[#c94543] font-medium transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product, index) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Image Container */}
              <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                
                {/* Discount Badge */}
                {product.isDiscountActive && (
                  <div className="absolute top-3 left-3 bg-[#e34f4d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(product._id, product.name);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-[#e34f4d] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-[#e34f4d]">
                    Rs.{(product.finalPrice || product.price)?.toFixed(2)}
                  </span>
                  {product.isDiscountActive && product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs.{product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-[#e34f4d] hover:bg-[#c94543] text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[#e34f4d] hover:text-[#c94543] font-medium transition-colors"
          >
            <Package className="w-5 h-5" />
            Discover More Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
