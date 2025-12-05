import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment-timezone";
import {
  getProductById,
  getProductReviews,
  saveProductReview,
  deleteProductReview,
} from "../services/api";

const fallbackImage =
  "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg";

const ratingOptions = [5, 4, 3, 2, 1];

const ProductDetails = ({ addToCart }) => {
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
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-xl shadow text-pink-600 font-semibold">
          Loading product...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
        <div className="bg-white px-6 py-4 rounded-xl shadow text-red-600 font-semibold text-center">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  const averageRating = Number(product.averageRating || 0).toFixed(1);

  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative bg-gray-100 flex items-center justify-center">
            {product.promotionBadge && (
              <span className="absolute top-6 left-6 bg-amber-200 text-amber-800 text-sm font-semibold px-4 py-1 rounded-full shadow">
                {product.promotionBadge}
              </span>
            )}
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain max-h-[520px] p-6"
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
            {product.videoUrl && (
              <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow text-sm text-pink-700">
                🎬 Product video available in admin preview
              </div>
            )}
          </div>

          <div className="p-6 lg:p-10 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-pink-700 mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-2xl font-bold text-pink-600">
                Rs.{Number(product.finalPrice ?? product.price).toFixed(2)}
              </span>
              {product.isDiscountActive && product.price && (
                <span className="text-gray-400 line-through">
                  Rs.{Number(product.price).toFixed(2)}
                </span>
              )}
              {product.discountPercentage > 0 && product.isDiscountActive && (
                <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-semibold text-yellow-600">
                ⭐ {averageRating}
              </span>
              <span>({product.ratingCount || 0} reviews)</span>
              <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {(product.bundleItems?.length > 0 ||
              product.promoCode ||
              product.promoDescription) && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 space-y-3">
                {product.bundleItems?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-pink-700 mb-2">
                      Bundle Includes
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {product.bundleItems.map((item, idx) => (
                        <li key={`${product._id}-detail-bundle-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.promoCode && (
                  <div className="flex flex-wrap items-center gap-3 text-sm text-purple-700">
                    <span className="font-semibold">
                      Use code <span className="uppercase tracking-wide">{product.promoCode}</span>
                    </span>
                    {product.promoExpiresAt && (
                      <span className="text-xs text-gray-500">
                        Expires:{" "}
                        {moment(product.promoExpiresAt)
                          .tz("Asia/Karachi")
                          .format("YYYY-MM-DD hh:mm A")}
                      </span>
                    )}
                  </div>
                )}

                {product.promoDescription && (
                  <p className="text-sm text-gray-600">{product.promoDescription}</p>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-3 rounded-xl shadow hover:from-pink-600 hover:to-rose-500 transition"
            >
              Add to Cart
            </button>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
              {reviews.length === 0 && (
                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
              )}
              <div className="space-y-4">
                {reviews.map((review) => {
                  const isOwner =
                    currentUser &&
                    (review.user?._id === currentUser.id || review.user?.email === currentUser.email);
                  const isAdmin = currentUser?.role === "admin";
                  return (
                    <div
                      key={review._id}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-pink-600">
                            {review.user?.firstName || review.user?.email || "Customer"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {moment(review.createdAt).fromNow()}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-yellow-600">
                          ⭐ {review.rating}
                        </span>
                      </div>
                      {review.title && (
                        <p className="mt-2 text-base font-semibold text-gray-800">{review.title}</p>
                      )}
                      {review.comment && (
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      {(isOwner || isAdmin) && (
                        <div className="mt-3 text-right">
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-pink-100 rounded-2xl p-5 shadow-inner">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Share your experience
              </h2>
              {!canSubmitReview ? (
                <p className="text-sm text-gray-600">
                  Please{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-pink-600 underline font-medium"
                  >
                    log in
                  </button>{" "}
                  to leave a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full border border-pink-300 rounded-lg p-2"
                      required
                    >
                      {ratingOptions.map((value) => (
                        <option key={value} value={value}>
                          {value} - {value === 5 ? "Excellent" : value === 1 ? "Very Poor" : "Good"}
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
                    className="w-full border border-pink-300 rounded-lg p-3"
                  />
                  <textarea
                    name="comment"
                    value={form.comment}
                    onChange={handleChange}
                    placeholder="Tell others about the product (optional)"
                    className="w-full border border-pink-300 rounded-lg p-3"
                    rows={4}
                  />
                  {reviewError && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-2">
                      {reviewError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductDetails.defaultProps = {
  addToCart: () => {},
};

export default ProductDetails;


