// src/components/ProductCard.jsx
import React, { useState, useRef, useEffect } from "react";
import { ShoppingCart, ArrowRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import toast from "react-hot-toast";

const ProductCard = ({ product, addToCart = () => {}, addToWishlist, removeFromWishlist, isInWishlist }) => {
  const [flipped, setFlipped] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "https://api.thegiftoasis.store";

  const productId = product._id || product.id;

  // fallback image
  const fallbackImage =
    "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg";

  // resolve image url
  const imageUrl = (() => {
    if (!product?.imageUrl) return fallbackImage;
    if (/^https?:\/\//i.test(product.imageUrl)) return product.imageUrl;
    return `${apiBase.replace(/\/$/, "")}/${product.imageUrl.replace(/^\//, "")}`;
  })();

  // resolve video url (usually absolute from Cloudinary)
  const videoUrl = (() => {
    if (!product?.videoUrl) return "";
    if (/^https?:\/\//i.test(product.videoUrl)) return product.videoUrl;
    return `${apiBase.replace(/\/$/, "")}/${String(product.videoUrl).replace(/^\//, "")}`;
  })();

  // backend fields
  const discountPercentage = Number(product?.discountPercentage || 0);
  const isDiscountActive = Boolean(product?.isDiscountActive);
  const discountExpiry = product?.discountExpiry ? new Date(product.discountExpiry) : null;
  const showExpiry = isDiscountActive && discountExpiry && discountExpiry > new Date();
  const finalPrice = product?.finalPrice ?? product?.price;
  const averageRating = Number(product?.averageRating || 0).toFixed(1);

  // Check if in wishlist
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

  // Lazy load images using IntersectionObserver
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

  // Discount tag presentation: theme + label by discount tier
  const discountTag = (() => {
    const dp = discountPercentage;
    let theme = "from-violet-500 to-indigo-500"; // default subtle
    let size = "text-[11px] px-3 py-1.5";
    let label = dp > 0 ? `-${dp}%` : ""; // Low tier default: -% (numeric first for compactness)

    if (dp >= 40) {
      theme = "from-rose-600 to-red-600";
      size = "text-[12px] px-3.5 py-1.5";
      // High tier (big discount): English label
      label = `${dp}% OFF`;
    } else if (dp >= 20) {
      theme = "from-pink-500 to-fuchsia-500";
      size = "text-[11.5px] px-3.5 py-1.5";
      // Mid tier: English SALE label
      label = `SALE ${dp}%`;
    }
    return { theme, size, label };
  })();

  return (
    <div
      className="w-72 h-96 cursor-pointer group"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute w-full h-full rounded-2xl shadow-xl overflow-hidden bg-white/20 backdrop-blur-lg border border-white/40 flex items-center justify-center"
          style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden" }}
        >
          {(product?.isFeatured || product?.promotionBadge) && (
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {product?.isFeatured && (
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  ⭐ Featured
                </span>
              )}
              {product?.promotionBadge && (
                <span className="bg-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {product.promotionBadge}
                </span>
              )}
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-yellow-600 shadow flex items-center gap-1">
            ⭐ {averageRating}
          </div>
          
          {/* Wishlist Button */}
          {(addToWishlist || removeFromWishlist) && (
            <button
              onClick={handleWishlistClick}
              className={`absolute top-4 right-16 z-10 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all hover:scale-110 ${
                inWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          )}

          {/* Stock Status Badge */}
          {product.stock !== undefined && (
            <div className="absolute bottom-4 left-4 z-10">
              {product.stockStatus === "out_of_stock" ? (
                <span className="px-2 py-1 bg-red-500/90 text-white text-xs rounded-full font-medium">
                  Out of Stock
                </span>
              ) : product.stockStatus === "low_stock" ? (
                <span className="px-2 py-1 bg-yellow-500/90 text-white text-xs rounded-full font-medium">
                  Only {product.stock} left
                </span>
              ) : null}
            </div>
          )}

          <div className="w-full h-full bg-gray-100" ref={imageRef}>
            {imageVisible && (
              videoUrl ? (
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover bg-black"
                  controls
                  playsInline
                  preload="metadata"
                  // Mobile: tap to flip (since double-tap isn't reliable on mobile)
                  onTouchStart={(e) => { e.stopPropagation(); setFlipped((f) => !f); }}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
              )
            )}
          </div>

          {isDiscountActive && (
            <div className="absolute top-0 right-4 flex flex-col items-center select-none">
              {/* High-tier badge above the tag */}
              {discountPercentage >= 40 && (
                <div className="mb-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-900 border border-amber-300 shadow-sm">
                  Deal of the Day
                </div>
              )}
              {/* string */}
              <div className="w-0.5 h-6 bg-gray-300/80" />
              {/* tag */}
              <div className="relative -mt-1 rotate-6 swing-on-hover" aria-label={`${discountPercentage}% discount tag`}>
                {/* hole */}
                <div className="absolute -top-1 left-2 w-2 h-2 bg-white rounded-full shadow-inner" />
                <div className={`bg-gradient-to-br ${discountTag.theme} text-white ${discountTag.size} font-semibold rounded-md shadow-lg tracking-wide border border-white/20`}
                >
                  {discountTag.label}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-white/60 to-gray-100/60 backdrop-blur-lg border border-white/40 p-5 flex flex-col justify-between"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800">{product?.name}</h3>
            <div className="w-12 h-1 bg-pink-500 rounded-full mt-2 mb-3"></div>

            <p className="text-sm text-gray-700">
              {product?.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {product?.category && (
                <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              )}
              {product?.brand && (
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-4 flex items-center justify-between bg-white/80 px-3 py-2 rounded-xl shadow-inner">
            <div>
              {isDiscountActive ? (
                <>
                  <span className="text-xl font-bold text-pink-600">
                    Rs.{finalPrice?.toFixed(2) || "0.00"}
                  </span>
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    Rs.{product?.price?.toFixed(2) || "0.00"}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-pink-600">
                  Rs.{product?.price?.toFixed(2) || "0.00"}
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({ ...product, _id: productId });
              }}
              className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white text-sm px-3 py-1 rounded-lg shadow"
            >
              <ShoppingCart size={16} /> Add
            </button>
          </div>

          {(product?.bundleItems?.length > 0 || product?.promoCode) && (
            <div className="mt-3 space-y-2">
              {product?.bundleItems?.length > 0 && (
                <div className="bg-purple-50 text-purple-700 text-xs rounded-lg px-3 py-2 shadow-inner">
                  Bundle: {product.bundleItems.slice(0, 2).join(", ")}
                  {product.bundleItems.length > 2 && " + more"}
                </div>
              )}
              {product?.promoCode && (
                <div className="bg-amber-50 text-amber-700 text-xs rounded-lg px-3 py-2 shadow-inner">
                  Use code <span className="font-semibold uppercase tracking-wide">{product.promoCode}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${productId}`);
            }}
            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
          >
            View Details <ArrowRight size={16} />
          </button>

          {/* Discount Expiry */}
          {showExpiry && (
            <div className="mt-3 text-center">
              <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                Deal ends:{" "}
                {moment.utc(discountExpiry).tz("Asia/Karachi").format("YYYY-MM-DD hh:mm A")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
