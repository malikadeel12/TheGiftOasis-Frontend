import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import toast from "react-hot-toast";

const ProductCard = ({ product, addToCart = () => {}, addToWishlist, removeFromWishlist, isInWishlist, viewMode = "grid" }) => {
  const [imageVisible, setImageVisible] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "https://api.thegiftoasis.store";

  const productId = product._id || product.id;

  const fallbackImage =
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg";

  const imageUrl = (() => {
    if (!product?.imageUrl) return fallbackImage;
    if (/^https?:\/\//i.test(product.imageUrl)) return product.imageUrl;
    return `${apiBase.replace(/\/$/, "")}/${product.imageUrl.replace(/^\//, "")}`;
  })();

  const discountPercentage = Number(product?.discountPercentage || 0);
  const isDiscountActive = Boolean(product?.isDiscountActive);
  const discountExpiry = product?.discountExpiry ? new Date(product.discountExpiry) : null;
  const showExpiry = isDiscountActive && discountExpiry && discountExpiry > new Date();
  const finalPrice = product?.finalPrice ?? product?.price;
  const averageRating = Number(product?.averageRating || 0).toFixed(1);

  const inWishlist = isInWishlist?.(productId);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist?.(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist?.(product);
      toast.success("Added to wishlist");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...product, _id: productId });
    toast.success("Added to cart!");
  };

  const handleViewDetails = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!productId) {
      console.error("No product ID found");
      return;
    }
    navigate(`/products/${productId}`);
  };

  return (
    <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden product-card-hover ${viewMode === "list" ? "flex" : ""}`} style={viewMode === "list" ? { height: "auto" } : {}}>
      {/* Image Container */}
      <div 
        ref={imageRef}
        className={`relative overflow-hidden cursor-pointer ${viewMode === "list" ? "w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0" : "aspect-square"}`}
        onClick={handleViewDetails}
      >
        {imageVisible && (
          <img
            src={imageUrl}
            alt={product?.name}
            className="w-full h-full object-cover product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        )}

        {/* Discount Badge */}
        {isDiscountActive && discountPercentage > 0 && (
          <div 
            className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10"
            style={{ backgroundColor: '#e34f4d' }}
          >
            -{discountPercentage}%
          </div>
        )}

        {/* Featured Badge */}
        {product?.isFeatured && (
          <div 
            className="absolute top-3 right-12 text-white text-xs font-semibold px-3 py-1.5 rounded-full z-10"
            style={{ backgroundColor: '#4b3f3b' }}
          >
            ⭐ Featured
          </div>
        )}

        {/* Promotion Badge */}
        {product?.promotionBadge && (
          <div 
            className="absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full z-10"
            style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
          >
            {product.promotionBadge}
          </div>
        )}

        {/* Wishlist Button */}
        {(addToWishlist || removeFromWishlist) && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md z-10"
            style={{ 
              backgroundColor: inWishlist ? '#e34f4d' : 'rgba(255,255,255,0.9)',
              color: inWishlist ? '#ffffff' : '#e34f4d'
            }}
          >
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
          <button
            onClick={handleAddToCart}
            className="bg-white text-[#e34f4d] px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-[#e34f4d] hover:text-white transition-colors"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className={`p-4 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 
            className="font-semibold text-base line-clamp-1 group-hover:text-[#e34f4d] transition-colors cursor-pointer"
            style={{ color: '#1a1a1a' }}
            onClick={handleViewDetails}
          >
            {product?.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-sm" style={{ color: '#666' }}>{averageRating}</span>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product?.category && (
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
            >
              {product.category}
            </span>
          )}
          {product?.brand && (
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: '#4b3f3b', color: '#ffffff' }}
            >
              {product.brand}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm mb-3 line-clamp-2" style={{ color: '#666' }}>
          {product?.description || "No description available"}
        </p>

        {/* Bundle Info */}
        {product?.bundleItems?.length > 0 && (
          <div 
            className="text-xs rounded-lg px-3 py-2 mb-3"
            style={{ backgroundColor: '#fbe8ec', color: '#4b3f3b' }}
          >
            <span className="font-semibold">Bundle:</span> {product.bundleItems.slice(0, 2).join(", ")}
            {product.bundleItems.length > 2 && " + more"}
          </div>
        )}

        {/* Promo Code */}
        {product?.promoCode && (
          <div 
            className="text-xs rounded-lg px-3 py-2 mb-3"
            style={{ backgroundColor: '#4b3f3b', color: '#ffffff' }}
          >
            Use code <span className="font-bold uppercase">{product.promoCode}</span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
          <div className="flex items-center gap-2">
            {isDiscountActive ? (
              <>
                <span className="text-lg font-bold" style={{ color: '#e34f4d' }}>
                  Rs.{finalPrice?.toFixed(2) || "0.00"}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  Rs.{product?.price?.toFixed(2) || "0.00"}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold" style={{ color: '#e34f4d' }}>
                Rs.{product?.price?.toFixed(2) || "0.00"}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!productId) {
                console.error("No product ID found");
                return;
              }
              navigate(`/products/${productId}`);
            }}
            className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            style={{ color: '#ffffff', backgroundColor: '#e34f4d' }}
          >
            View Details
          </button>
        </div>

        {/* Discount Expiry */}
        {showExpiry && (
          <div className="mt-3 text-center">
            <span 
              className="inline-block text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
            >
              Deal ends: {moment.utc(discountExpiry).tz("Asia/Karachi").format("MMM DD")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
