// src/pages/AdminDashboard.jsx
import React, { useCallback, useEffect, useState } from "react";
import api, {
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  getAllBlogPostsAdmin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../services/api";
import moment from "moment-timezone";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // "products" or "orders"
  
  // Products state
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [totalOrderPages, setTotalOrderPages] = useState(1);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogForm, setBlogForm] = useState(initialBlogForm());
  const [blogEditingId, setBlogEditingId] = useState(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogMessage, setBlogMessage] = useState("");

  function initialForm() {
    return {
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      video: null,
      discountPercentage: "",
      discountStart: "",
      discountEnd: "",
      isFeatured: false,
      promotionBadge: "",
      promoCode: "",
      promoDescription: "",
      promoExpiresAt: "",
      bundleItemsInput: "",
    };
  }

  function initialBlogForm() {
    return {
      title: "",
      summary: "",
      content: "",
      coverImage: "",
      status: "draft",
      tagsInput: "",
      readingMinutes: 3,
      seoTitle: "",
      seoDescription: "",
    };
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setData(res.data.products || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setData([]);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAllOrders({
        status: orderStatusFilter === "all" ? "" : orderStatusFilter,
        page: orderPage,
        limit: 10,
      });
      setOrders(res.data.orders || []);
      setTotalOrderPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Fetch orders error:", err);
      setOrders([]);
    }
  }, [orderStatusFilter, orderPage]);

  const fetchOrderStats = useCallback(async () => {
    try {
      const res = await getOrderStats();
      setOrderStats(res.data);
    } catch (err) {
      console.error("❌ Fetch stats error:", err);
    }
  }, []);

  const fetchBlogPosts = useCallback(async () => {
    try {
      setBlogLoading(true);
      const res = await getAllBlogPostsAdmin();
      setBlogPosts(res.data.posts || []);
    } catch (err) {
      console.error("❌ Fetch blog posts error:", err);
      setBlogMessage("❌ Failed to load blog posts");
      setTimeout(() => setBlogMessage(""), 3000);
      setBlogPosts([]);
    } finally {
      setBlogLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
      fetchOrderStats();
    } else if (activeTab === "blog") {
      fetchBlogPosts();
    }
  }, [activeTab, fetchOrders, fetchOrderStats, fetchBlogPosts]);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus, notes = "") => {
    try {
      setOrderLoading(true);
      await updateOrderStatus(orderId, newStatus, notes);
      setMessage(`✅ Order status updated to ${newStatus}`);
      fetchOrders();
      fetchOrderStats();
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Error updating order"}`);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setOrderLoading(false);
    }
  };

  // View Order Details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files?.[0] || null });
    } else if (name === "video") {
      setForm({ ...form, video: files?.[0] || null });
    } else if (name === "isFeatured") {
      setForm({ ...form, isFeatured: e.target.checked });
    } else if (name === "bundleItemsInput") {
      setForm({ ...form, bundleItemsInput: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm(initialForm());
    setEditingId(null);
    setIsModalOpen(false);
    setMessage("");
  };

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlogForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetBlogForm = () => {
    setBlogForm(initialBlogForm());
    setBlogEditingId(null);
    setIsBlogModalOpen(false);
    setBlogMessage("");
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setBlogLoading(true);
    setBlogMessage("");

    const payload = {
      title: blogForm.title,
      summary: blogForm.summary,
      content: blogForm.content,
      coverImage: blogForm.coverImage,
      status: blogForm.status,
      readingMinutes: Number(blogForm.readingMinutes) || 3,
      seoTitle: blogForm.seoTitle,
      seoDescription: blogForm.seoDescription,
      tags:
        blogForm.tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean) || [],
    };

    try {
      if (blogEditingId) {
        await updateBlogPost(blogEditingId, payload);
        setBlogMessage("✅ Blog post updated!");
      } else {
        await createBlogPost(payload);
        setBlogMessage("✅ Blog post created!");
      }
      resetBlogForm();
      fetchBlogPosts();
    } catch (err) {
      console.error("❌ Blog submit error:", err);
      setBlogMessage(err.response?.data?.message || "❌ Failed to save blog post");
    } finally {
      setBlogLoading(false);
      setTimeout(() => setBlogMessage(""), 3000);
    }
  };

  const handleBlogEdit = (post) => {
    setBlogForm({
      title: post.title || "",
      summary: post.summary || "",
      content: post.content || "",
      coverImage: post.coverImage || "",
      status: post.status || "draft",
      tagsInput: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      readingMinutes: post.readingMinutes || 3,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
    });
    setBlogEditingId(post._id);
    setIsBlogModalOpen(true);
  };

  const handleBlogDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlogPost(id);
      setBlogMessage("🗑️ Blog post deleted");
      fetchBlogPosts();
    } catch (err) {
      console.error("❌ Delete blog error:", err);
      setBlogMessage(err.response?.data?.message || "❌ Failed to delete blog post");
    } finally {
      setTimeout(() => setBlogMessage(""), 3000);
    }
  };


  // ✅ Updated: Use moment.tz to format for datetime-local input in Asia/Karachi
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return moment.tz(dateStr, "Asia/Karachi").format("YYYY-MM-DDTHH:mm");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;

      if (key === "bundleItemsInput") {
        formData.append("bundleItems", value);
        return;
      }

      if (key === "isFeatured") {
        formData.append(key, value ? "true" : "false");
        return;
      }

      formData.append(key, value);
    });

    try {
      if (editingId) {
        const res = await api.put(`/admin/update-product/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product updated successfully!");
      } else {
        const res = await api.post("/admin/add-product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product added successfully!");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("❌ Submit error:", err.response || err.message);
      setMessage(`❌ ${err.response?.data?.message || "Error saving product"}`);
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      image: null,
      discountPercentage: product.discountPercentage || "",
      discountStart: formatDateForInput(product.discountStart),
      discountEnd: formatDateForInput(product.discountEnd),
      isFeatured: Boolean(product.isFeatured),
      promotionBadge: product.promotionBadge || "",
      promoCode: product.promoCode || "",
      promoDescription: product.promoDescription || "",
      promoExpiresAt: formatDateForInput(product.promoExpiresAt),
      bundleItemsInput: Array.isArray(product.bundleItems)
        ? product.bundleItems.join("\n")
        : "",
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await api.delete(`/admin/delete-product/${id}`);
      setMessage("🗑 Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Error deleting product"}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      dispatched: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-pink-100 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 text-pink-700 text-center">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "products"
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-pink-600 border-2 border-pink-300"
            }`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "orders"
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-pink-600 border-2 border-pink-300"
            }`}
          >
            🛍️ Orders
            {orderStats?.pending > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {orderStats.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === "blog"
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-pink-600 border-2 border-pink-300"
            }`}
          >
            📝 Blog
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </div>
        )}
        {blogMessage && activeTab === "blog" && (
          <div className={`mb-4 p-3 rounded-lg text-center ${blogMessage.includes("✅") || blogMessage.includes("🗑️") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {blogMessage}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm());
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                ➕ Add New Product
              </button>
            </div>

            {data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data.map((product) => {
              const finalPrice = product.finalPrice ?? product.price;
              const avgRating = Number(product.averageRating || 0).toFixed(1);

              return (
                <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
                  {(product.isFeatured || product.promotionBadge) && (
                    <div className="absolute top-4 left-4 z-10">
                      {product.isFeatured && (
                        <span className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          ⭐ Featured
                        </span>
                      )}
                      {product.promotionBadge && (
                        <span className="ml-2 inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {product.promotionBadge}
                        </span>
                      )}
                    </div>
                  )}
                  {product.videoUrl ? (
                    <video
                      src={product.videoUrl}
                      className="w-full h-64 object-contain bg-black"
                      controls
                      playsInline
                      preload="metadata"
                      poster={product.imageUrl || undefined}
                    />
                  ) : (
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="w-full h-64 object-contain p-2"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-pink-700">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>

                    {product.isDiscountActive && product.discountPercentage > 0 ? (
                      <>
                        <p className="text-gray-500 line-through">₨ {product.price}</p>
                        <p className="text-pink-500 font-semibold">
                          ₨ {finalPrice.toFixed(2)}{" "}
                          <span className="text-xs text-green-600">
                            ({product.discountPercentage}% OFF)
                          </span>
                        </p>
                        {product.discountExpiry && (
                          <span className="text-xs text-red-500 block mb-2">
                            Deal ends:{" "}
                            {moment.utc(product.discountExpiry)
                              .tz("Asia/Karachi")
                              .format("YYYY-MM-DD hh:mm A")}

                          </span>
                        )}
                      </>
                    ) : (
                      <p className="text-pink-500 font-semibold">₨ {product.price}</p>
                    )}

                    <span className="text-xs text-gray-500 block mb-3">
                      Category: {product.category}
                    </span>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Rating: ⭐ {avgRating} ({product.ratingCount || 0})</span>
                      {product.totalSold !== undefined && (
                        <span className="text-green-600 font-medium">
                          Sold: {product.totalSold}
                        </span>
                      )}
                    </div>

                    {(product.bundleItems?.length > 0 || product.promoCode) && (
                      <div className="bg-pink-50 border border-pink-100 rounded-lg p-3 mb-3 text-sm text-gray-700 space-y-2">
                        {product.bundleItems?.length > 0 && (
                          <div>
                            <p className="font-semibold text-pink-600 mb-1">Bundle Includes:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                              {product.bundleItems.map((item, idx) => (
                                <li key={`${product._id}-bundle-${idx}`}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.promoCode && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="font-semibold text-purple-600">
                              Promo Code: <span className="tracking-wide uppercase">{product.promoCode}</span>
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
                          <p className="text-xs text-gray-500 italic">{product.promoDescription}</p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
            ) : (
              <p className="text-center text-gray-500">No products found</p>
            )}
          </>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div>
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setBlogEditingId(null);
                  setBlogForm(initialBlogForm());
                  setIsBlogModalOpen(true);
                }}
                className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                ✍️ Create Blog Post
              </button>
            </div>

            {blogLoading ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {Array(4)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="h-48 bg-white rounded-3xl shadow animate-pulse" />
                  ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="bg-white border border-pink-100 rounded-3xl px-6 py-10 text-center text-pink-600 shadow">
                No blog posts yet. Share your first story!
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {blogPosts.map((post) => (
                  <div key={post._id} className="bg-white rounded-3xl shadow p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {post.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {moment(post.updatedAt).tz("Asia/Karachi").format("MMM DD, YYYY")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-pink-700">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{post.summary}</p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 text-xs text-pink-600">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="bg-pink-100 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleBlogEdit(post)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleBlogDelete(post._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {/* Order Statistics */}
            {orderStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-md text-center">
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-pink-600">{orderStats.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 shadow-md text-center border-2 border-yellow-300">
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 shadow-md text-center border-2 border-green-300">
                  <p className="text-gray-600 text-sm">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 shadow-md text-center border-2 border-blue-300">
                  <p className="text-gray-600 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">Rs.{orderStats.totalRevenue?.toFixed(0) || 0}</p>
                </div>
              </div>
            )}

            {/* Order Status Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {["all", "pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setOrderStatusFilter(status);
                      setOrderPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      orderStatusFilter === status
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-pink-50"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-pink-700 font-mono">
                            {order.orderNumber}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          <strong>{order.customerInfo.name}</strong> • {order.customerInfo.phone}
                        </p>
                        <p className="text-sm text-gray-500">{order.customerInfo.address}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {moment(order.createdAt).tz("Asia/Karachi").format("YYYY-MM-DD hh:mm A")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xl font-bold text-green-600">
                          Rs. {order.totalAmount.toFixed(2)}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            View
                          </button>
                          {order.status === "pending" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, "confirmed")}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No orders found</p>
            )}

            {/* Pagination */}
            {totalOrderPages > 1 && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="px-4 py-2 bg-white border border-pink-300 rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-4 py-2">
                  Page {orderPage} of {totalOrderPages}
                </span>
                <button
                  onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                  disabled={orderPage === totalOrderPages}
                  className="px-4 py-2 bg-white border border-pink-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-pink-600 text-center">
              {editingId ? "✏️ Edit Product" : "🌸 Add New Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Name, Description, Price, Category, Image */}
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <input
                list="categories"
                name="category"
                placeholder="Select or Add New Category"
                value={form.category}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                required
              />
              <datalist id="categories">
                <option value="Polaroids" />
                <option value="Frames" />
                <option value="Midnight Surprise" />
                <option value="Acrylic Boxies" />
                <option value="Eid Collection" />
                <option value="Gift Boxes" />
                <option value="Bouquets" />
              </datalist>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              {/* Discount Fields */}
              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount %"
                value={form.discountPercentage}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />
              <label className="text-sm text-gray-500">Discount Start</label>
              <input
                type="datetime-local"
                name="discountStart"
                value={form.discountStart}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />
              <label className="text-sm text-gray-500">Discount End</label>
              <input
                type="datetime-local"
                name="discountEnd"
                value={form.discountEnd}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="accent-pink-500 h-5 w-5"
                />
                <label htmlFor="isFeatured" className="text-gray-700 font-medium">
                  Mark as Featured Product
                </label>
              </div>

              <input
                type="text"
                name="promotionBadge"
                placeholder="Promotion Badge (e.g. Bundle Deal)"
                value={form.promotionBadge}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              <input
                type="text"
                name="promoCode"
                placeholder="Promo Code (optional)"
                value={form.promoCode}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4 uppercase tracking-wider"
              />

              <textarea
                name="promoDescription"
                placeholder="Promotion description (shown with promo code)"
                value={form.promoDescription}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                rows={3}
              />

              <label className="text-sm text-gray-500">Promo Expiry</label>
              <input
                type="datetime-local"
                name="promoExpiresAt"
                value={form.promoExpiresAt}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
              />

              <textarea
                name="bundleItemsInput"
                placeholder="Bundle items (one per line)"
                value={form.bundleItemsInput}
                onChange={handleChange}
                className="border border-pink-300 rounded-lg w-full p-3 mb-4"
                rows={3}
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg"
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                      ? "Update Product"
                      : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium ${message.includes("✅") || message.includes("🗑")
                    ? "text-green-600"
                    : "text-red-500"
                  }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-pink-600 text-center">
              {blogEditingId ? "✏️ Edit Blog Post" : "📝 New Blog Post"}
            </h2>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={blogForm.title}
                onChange={handleBlogChange}
                placeholder="Title"
                className="border border-pink-200 rounded-lg w-full p-3"
                required
              />
              <textarea
                name="summary"
                value={blogForm.summary}
                onChange={handleBlogChange}
                placeholder="Short summary"
                className="border border-pink-200 rounded-lg w-full p-3"
                rows={3}
              />
              <textarea
                name="content"
                value={blogForm.content}
                onChange={handleBlogChange}
                placeholder="Story content (supports HTML)"
                className="border border-pink-200 rounded-lg w-full p-3 font-mono text-sm"
                rows={10}
              />
              <input
                type="text"
                name="coverImage"
                value={blogForm.coverImage}
                onChange={handleBlogChange}
                placeholder="Cover image URL (optional)"
                className="border border-pink-200 rounded-lg w-full p-3"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  name="status"
                  value={blogForm.status}
                  onChange={handleBlogChange}
                  className="border border-pink-200 rounded-lg w-full p-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <input
                  type="number"
                  name="readingMinutes"
                  value={blogForm.readingMinutes}
                  onChange={handleBlogChange}
                  min={1}
                  className="border border-pink-200 rounded-lg w-full p-3"
                  placeholder="Reading time (minutes)"
                />
              </div>
              <textarea
                name="tagsInput"
                value={blogForm.tagsInput}
                onChange={handleBlogChange}
                placeholder="Tags (comma separated)"
                className="border border-pink-200 rounded-lg w-full p-3"
                rows={2}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="seoTitle"
                  value={blogForm.seoTitle}
                  onChange={handleBlogChange}
                  placeholder="SEO Title (optional)"
                  className="border border-pink-200 rounded-lg w-full p-3"
                />
                <input
                  type="text"
                  name="seoDescription"
                  value={blogForm.seoDescription}
                  onChange={handleBlogChange}
                  placeholder="SEO Description (optional)"
                  className="border border-pink-200 rounded-lg w-full p-3"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  type="submit"
                  disabled={blogLoading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg"
                >
                  {blogLoading
                    ? blogEditingId
                      ? "Updating..."
                      : "Publishing..."
                    : blogEditingId
                    ? "Update Post"
                    : "Publish Post"}
                </button>
                <button
                  type="button"
                  onClick={resetBlogForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold mb-4 text-pink-600">
              Order Details: {selectedOrder.orderNumber}
            </h2>

            {/* Customer Info */}
            <div className="bg-pink-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-pink-700 mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
            </div>

            {/* Category Summary */}
            {selectedOrder.items.some(item => item.category) && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 border border-purple-100">
                <h3 className="font-bold text-purple-700 mb-2">📂 Categories in this Order</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(selectedOrder.items.map(item => item.category).filter(Boolean))).map((category, idx) => (
                    <span 
                      key={idx} 
                      className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-purple-200"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-4">
              <h3 className="font-bold text-pink-700 mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.category && (
                          <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full mt-1">
                            📁 {item.category}
                          </span>
                        )}
                        <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity} × Rs.{item.price}</p>
                      </div>
                    </div>
                    <p className="font-bold">Rs. {(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-blue-700 mb-2">Payment Information</h3>
              <p><strong>Method:</strong> {selectedOrder.paymentInfo.method.toUpperCase()}</p>
              {selectedOrder.paymentInfo.screenshotUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Screenshot:</p>
                  <a
                    href={selectedOrder.paymentInfo.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Screenshot
                  </a>
                </div>
              )}
            </div>

            {/* Status Update */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-700 mb-2">Update Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["confirmed", "processing", "dispatched", "delivered", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateOrderStatus(selectedOrder._id, status)}
                      disabled={orderLoading || selectedOrder.status === status}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedOrder.status === status
                          ? "bg-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                Rs. {selectedOrder.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsOrderModalOpen(false);
                setSelectedOrder(null);
              }}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
