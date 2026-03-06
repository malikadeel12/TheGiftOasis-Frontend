import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import { Heart, ShoppingCart, Star, ChevronLeft, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import {
  getProductById,
  getProductReviews,
  saveProductReview,
  deleteProductReview,
} from "../services/api";

const fallbackImage =
  "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg";

const ratingOptions = [5, 4, 3, 2, 1];

const ProductDetails = ({ addToCart = () => {}, addToWishlist, removeFromWishlist, isInWishlist }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const inWishlist = isInWishlist?.(productId);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    } catch (err) {
      console.warn("Failed to decode token for reviews:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          getProductById(productId),
          getProductReviews(productId),
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data?.reviews || []);
        setError("");
      } catch (err) {
        console.error("❌ Product details load error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const canSubmitReview = Boolean(currentUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const refreshReviews = async () => {
    try {
      const res = await getProductReviews(productId);
      setReviews(res.data?.reviews || []);
    } catch (err) {
      console.error("❌ Review refresh error:", err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!canSubmitReview) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      setReviewError("");
      await saveProductReview(productId, {
        rating: Number(form.rating),
        title: form.title,
        comment: form.comment,
      });
      setForm({ rating: 5, title: "", comment: "" });
      await refreshReviews();
      const res = await getProductById(productId);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Review submit error:", err);
      setReviewError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteProductReview(productId, reviewId);
      await refreshReviews();
      const res = await getProductById(productId);
      setProduct(res.data);
    } catch (err) {
      console.error("❌ Delete review error:", err);
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      ...product,
      price: product.finalPrice ?? product.price,
    });
    toast.success("Added to cart!");
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist?.(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist?.(product);
      toast.success("Added to wishlist");
    }
  };

  const imageUrl = useMemo(() => {
    if (!product?.imageUrl) return fallbackImage;
    if (/^https?:\/\//i.test(product.imageUrl)) return product.imageUrl;
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "https://api.thegiftoasis.store";
    return `${apiBase.replace(/\/$/, "")}/${String(product.imageUrl).replace(/^\//, "")}`;
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffd5d8' }}>
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg" style={{ color: '#e34f4d' }}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#e34f4d] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#ffd5d8' }}>
        <div className="bg-white px-8 py-6 rounded-2xl shadow-lg text-center max-w-md">
          <p className="text-lg font-semibold mb-4" style={{ color: '#e34f4d' }}>{error || "Product not found"}</p>
          <Link 
            to="/shop"
            className="inline-block px-6 py-2 rounded-full text-white font-medium"
            style={{ backgroundColor: '#e34f4d' }}
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = Number(product.averageRating || 0).toFixed(1);
  const discountPercentage = Number(product?.discountPercentage || 0);
  const isDiscountActive = Boolean(product?.isDiscountActive);
  const finalPrice = product?.finalPrice ?? product?.price;

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#ffd5d8' }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:text-[#e34f4d] transition-colors" style={{ color: '#666' }}>Home</Link>
            <span style={{ color: '#999' }}>/</span>
            <Link to="/shop" className="hover:text-[#e34f4d] transition-colors" style={{ color: '#666' }}>Shop</Link>
            <span style={{ color: '#999' }}>/</span>
            <span style={{ color: '#e34f4d' }} className="font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:text-[#e34f4d] transition-colors"
          style={{ color: '#666' }}
        >
          <ChevronLeft size={20} />
          Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Image Section */}
            <div className="relative bg-gray-50 p-6 lg:p-10">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {product.isFeatured && (
                  <span 
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#4b3f3b' }}
                  >
                    ⭐ FEATURED
                  </span>
                )}
                {isDiscountActive && discountPercentage > 0 && (
                  <span 
                    className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: '#e34f4d' }}
                  >
                    -{discountPercentage}% OFF
                  </span>
                )}
                {product.promotionBadge && (
                  <span 
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
                  >
                    {product.promotionBadge}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                    inWishlist 
                      ? "bg-[#e34f4d] text-white" 
                      : "bg-white text-gray-400 hover:text-[#e34f4d]"
                  }`}
                >
                  <Heart size={22} fill={inWishlist ? "currentColor" : "none"} />
                </button>
                <button
                  className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-[#e34f4d] transition-all hover:scale-110"
                >
                  <Share2 size={22} />
                </button>
              </div>

              {/* Main Image */}
              <div className="aspect-square flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-10">
              {/* Category & Brand */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
                  >
                    {product.category}
                  </span>
                )}
                {product.brand && (
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#4b3f3b', color: '#ffffff' }}
                  >
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={18}
                      className={i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="font-semibold" style={{ color: '#e34f4d' }}>{averageRating}</span>
                <span style={{ color: '#999' }}>({product.ratingCount || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl lg:text-4xl font-bold" style={{ color: '#e34f4d' }}>
                  Rs.{Number(finalPrice).toFixed(2)}
                </span>
                {isDiscountActive && product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      Rs.{Number(product.price).toFixed(2)}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: '#fbe8ec', color: '#e34f4d' }}
                    >
                      Save Rs.{Number(product.price - finalPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-base mb-6 leading-relaxed" style={{ color: '#666' }}>
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: '#fbe8ec' }}>
                <div className="text-center">
                  <Truck className="mx-auto mb-2" size={24} style={{ color: '#e34f4d' }} />
                  <p className="text-xs font-medium" style={{ color: '#4b3f3b' }}>All Pakistan Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2" size={24} style={{ color: '#e34f4d' }} />
                  <p className="text-xs font-medium" style={{ color: '#4b3f3b' }}>100% Original</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="mx-auto mb-2" size={24} style={{ color: '#e34f4d' }} />
                  <p className="text-xs font-medium" style={{ color: '#4b3f3b' }}>Quality Guaranteed</p>
                </div>
              </div>

              {/* Bundle Items */}
              {product.bundleItems?.length > 0 && (
                <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: 'rgba(227, 79, 77, 0.2)' }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1a1a1a' }}>
                    <span>🎁</span> Bundle Includes:
                  </h3>
                  <ul className="space-y-2">
                    {product.bundleItems.map((item, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-center gap-2 text-sm"
                        style={{ color: '#666' }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#e34f4d' }}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Promo Code */}
              {product.promoCode && (
                <div 
                  className="mb-6 p-4 rounded-xl flex items-center justify-between"
                  style={{ backgroundColor: '#4b3f3b' }}
                >
                  <div>
                    <p className="text-sm text-white/80 mb-1">Use Promo Code:</p>
                    <p className="text-xl font-bold text-white uppercase tracking-wider">{product.promoCode}</p>
                  </div>
                  {product.promoExpiresAt && (
                    <div className="text-right">
                      <p className="text-xs text-white/60">Expires:</p>
                      <p className="text-sm text-white">
                        {moment(product.promoExpiresAt).tz("Asia/Karachi").format("MMM DD, YYYY")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:opacity-90 mb-4"
                style={{ 
                  backgroundColor: '#e34f4d',
                  color: '#ffffff'
                }}
              >
                <ShoppingCart size={22} />
                Add to Cart
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 text-xs" style={{ color: '#999' }}>
                <span>✓ 100% Authentic</span>
                <span>✓ Quality Guaranteed</span>
                <span>✓ Best Prices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex border-b" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
            {[
              { id: 'description', label: 'Description' },
              { id: 'details', label: 'Product Details' },
              { id: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-4 text-sm font-medium transition-colors relative"
                style={{ 
                  color: activeTab === tab.id ? '#e34f4d' : '#666',
                  backgroundColor: activeTab === tab.id ? '#fbe8ec' : 'transparent'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#e34f4d' }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#1a1a1a' }}>About This Product</h3>
                <p className="leading-relaxed" style={{ color: '#666' }}>{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#fbe8ec' }}>
                    <h4 className="font-semibold mb-2" style={{ color: '#e34f4d' }}>Perfect For</h4>
                    <p className="text-sm" style={{ color: '#666' }}>Birthdays, Anniversaries, Special Occasions</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#fbe8ec' }}>
                    <h4 className="font-semibold mb-2" style={{ color: '#e34f4d' }}>Delivery</h4>
                    <p className="text-sm" style={{ color: '#666' }}>All over Pakistan. Same-day delivery available for Rwp/Isb.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#1a1a1a' }}>Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.category && (
                    <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
                      <span style={{ color: '#999' }}>Category</span>
                      <span className="font-medium" style={{ color: '#1a1a1a' }}>{product.category}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
                      <span style={{ color: '#999' }}>Brand</span>
                      <span className="font-medium" style={{ color: '#1a1a1a' }}>{product.brand}</span>
                    </div>
                  )}
                  {product.discountPercentage > 0 && (
                    <div className="flex justify-between py-3 border-b" style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}>
                      <span style={{ color: '#999' }}>Discount</span>
                      <span className="font-medium" style={{ color: '#e34f4d' }}>{product.discountPercentage}% OFF</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: '#e34f4d' }}>{averageRating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span style={{ color: '#999' }}>({reviews.length} reviews)</span>
                  </div>
                </div>

                {/* Review Form */}
                <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: '#fbe8ec' }}>
                  {!canSubmitReview ? (
                    <p className="text-center">
                      Please{" "}
                      <Link to="/login" className="font-semibold underline" style={{ color: '#e34f4d' }}>
                        log in
                      </Link>
                      {" "}to leave a review.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#666' }}>Rating</label>
                        <select
                          name="rating"
                          value={form.rating}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border bg-white"
                          style={{ borderColor: 'rgba(227, 79, 77, 0.2)' }}
                        >
                          {ratingOptions.map((value) => (
                            <option key={value} value={value}>
                              {value} Stars
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Review title (optional)"
                        className="w-full p-3 rounded-lg border"
                        style={{ borderColor: 'rgba(227, 79, 77, 0.2)' }}
                      />
                      <textarea
                        name="comment"
                        value={form.comment}
                        onChange={handleChange}
                        placeholder="Write your review..."
                        rows={4}
                        className="w-full p-3 rounded-lg border"
                        style={{ borderColor: 'rgba(227, 79, 77, 0.2)' }}
                      />
                      
                      {reviewError && (
                        <p className="text-sm text-red-500">{reviewError}</p>
                      )}
                      
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#e34f4d' }}
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-center py-8" style={{ color: '#999' }}>No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => {
                      const isOwner = currentUser && (review.user?._id === currentUser.id || review.user?.email === currentUser.email);
                      const isAdmin = currentUser?.role === "admin";
                      
                      return (
                        <div 
                          key={review._id} 
                          className="p-4 rounded-xl border"
                          style={{ borderColor: 'rgba(227, 79, 77, 0.1)' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold" style={{ color: '#1a1a1a' }}>
                                {review.user?.firstName || review.user?.email || "Anonymous"}
                              </p>
                              <p className="text-xs" style={{ color: '#999' }}>
                                {moment(review.createdAt).format("MMM DD, YYYY")}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {review.title && (
                            <p className="font-medium mb-2" style={{ color: '#1a1a1a' }}>{review.title}</p>
                          )}
                          
                          {review.comment && (
                            <p className="text-sm" style={{ color: '#666' }}>{review.comment}</p>
                          )}
                          
                          {(isOwner || isAdmin) && (
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="mt-3 text-xs text-red-500 hover:underline"
                            >
                              Delete Review
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
