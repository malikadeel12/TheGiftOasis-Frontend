// src/components/ProductCard.jsx
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, addToCart }) => {
  const [flipped, setFlipped] = useState(false);
  const [imageClasses, setImageClasses] = useState({});

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "https://thegiftoasis-backend.onrender.com";

  const productId = product._id || product.id;

  // ✅ Handle images
  const images =
    product?.images && product.images.length > 0
      ? product.images.map((img) =>
          img.startsWith("http")
            ? img
            : `${apiBase}/${img.replace(/^\/+/, "")}`
        )
      : [
          product?.imageUrl || product?.image
            ? (product.imageUrl || product.image).startsWith("http")
              ? product.imageUrl || product.image
              : `${apiBase}/${(product.imageUrl || product.image).replace(/^\/+/, "")}`
            : "https://via.placeholder.com/400x400.png?text=No+Image",
        ];

  // ✅ Backend discount fields
  const discountPercentage = Number(product?.discount || 0);
  const isDiscountActive = Boolean(product?.isDiscountActive);
  const discountExpiry = product?.discountExpiry
    ? new Date(product.discountExpiry)
    : null;

  const showExpiry =
    isDiscountActive && discountExpiry && discountExpiry > new Date();

  const finalPrice = isDiscountActive
    ? product.price - (product.price * discountPercentage) / 100
    : product.price;

  const handleImageLoad = (e, idx) => {
    const img = e.target;
    const isLandscape = img.naturalWidth > img.naturalHeight;
    setImageClasses((prev) => ({
      ...prev,
      [idx]: isLandscape ? "object-contain" : "object-cover",
    }));
  };

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
          {images.length > 1 ? (
            <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-full h-full flex-shrink-0 snap-center bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`${product?.name}-${idx}`}
                    className={`w-full h-full ${imageClasses[idx] || "object-cover"}`}
                    onLoad={(e) => handleImageLoad(e, idx)}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/400x400.png?text=Image+Not+Found")
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100">
              <img
                src={images[0]}
                alt={product?.name}
                className={`w-full h-full ${imageClasses[0] || "object-cover"}`}
                onLoad={(e) => handleImageLoad(e, 0)}
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400x400.png?text=Image+Not+Found")
                }
              />
            </div>
          )}

          {isDiscountActive && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              -{discountPercentage}%
            </span>
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
            >
              <ShoppingCart size={18} className="inline mr-1" /> Add
            </button>
          </div>

          {/* Discount Expiry */}
          {showExpiry && (
            <div className="mt-3 text-center">
              <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                Deal ends:{" "}
                {discountExpiry.toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
