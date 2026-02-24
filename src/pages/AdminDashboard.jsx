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
import toast from "react-hot-toast";
import OrderTimeline from "../components/OrderTimeline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  Truck,
  Star,
  Tag,
  Calendar,
  Image as ImageIcon,
  Video,
  Save,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Products state
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [totalOrderPages, setTotalOrderPages] = useState(1);

  // Blog state
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
      stock: "",
      lowStockThreshold: "5",
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
    fetchProducts();
    fetchOrders();
    fetchOrderStats();
    fetchBlogPosts();
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

  const handleUpdateOrderStatus = async (orderId, newStatus, notes = "") => {
    try {
      setOrderLoading(true);
      await updateOrderStatus(orderId, newStatus, notes);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      fetchOrderStats();
      setIsOrderModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating order");
    } finally {
      setOrderLoading(false);
    }
  };

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
      if (value === null || value === undefined) return;

      if (key === "bundleItemsInput") {
        formData.append("bundleItems", value);
        return;
      }

      if (key === "isFeatured") {
        formData.append(key, value ? "true" : "false");
        return;
      }

      if (key === "stock" || key === "lowStockThreshold") {
        formData.append(key, value === "" ? "0" : String(value));
        return;
      }

      if (value === "") return;

      formData.append(key, value);
    });

    try {
      if (editingId) {
        await api.put(`/admin/update-product/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Product updated successfully!");
      } else {
        await api.post("/admin/add-product", formData, {
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
      video: null,
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
      stock: product.stock || "",
      lowStockThreshold: product.lowStockThreshold || "5",
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/delete-product/${id}`);
      setMessage("🗑 Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Error deleting product"}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      confirmed: "bg-blue-100 text-blue-700 border-blue-200",
      processing: "bg-purple-100 text-purple-700 border-purple-200",
      dispatched: "bg-indigo-100 text-indigo-700 border-indigo-200",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Package,
      dispatched: Truck,
      delivered: CheckCircle,
      cancelled: X,
    };
    return icons[status] || Clock;
  };

  const filteredProducts = data.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesFilter = productFilter === "all" || 
      (productFilter === "featured" && product.isFeatured) ||
      (productFilter === "low-stock" && product.stockStatus === "low_stock") ||
      (productFilter === "out-of-stock" && product.stockStatus === "out_of_stock");
    return matchesSearch && matchesFilter;
  });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: orderStats?.pending },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-40`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">GiftOasis</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                )}
                {sidebarOpen && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`bg-slate-800 rounded-xl p-4 ${sidebarOpen ? "" : "p-2"}`}>
            {sidebarOpen ? (
              <>
                <p className="text-xs text-slate-400 mb-1">Admin Panel</p>
                <p className="text-sm font-medium">v2.0.0</p>
              </>
            ) : (
              <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto" />
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {navItems.find((i) => i.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {activeTab === "dashboard" && "Overview of your store performance"}
                {activeTab === "products" && `Manage ${data.length} products`}
                {activeTab === "orders" && `${orderStats?.total || 0} total orders`}
                {activeTab === "blog" && `${blogPosts.length} blog posts`}
                {activeTab === "analytics" && "Detailed insights and reports"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{moment().tz("Asia/Karachi").format("MMMM D, YYYY")}</p>
                <p className="text-xs text-slate-500">{moment().tz("Asia/Karachi").format("h:mm A")}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardOverview
              orderStats={orderStats}
              products={data}
              orders={orders}
              onTabChange={setActiveTab}
            />
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductsTab
              products={filteredProducts}
              search={productSearch}
              setSearch={setProductSearch}
              filter={productFilter}
              setFilter={setProductFilter}
              onAdd={() => {
                setEditingId(null);
                setForm(initialForm());
                setIsModalOpen(true);
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              orderStats={orderStats}
              statusFilter={orderStatusFilter}
              setStatusFilter={setOrderStatusFilter}
              onView={handleViewOrder}
              onUpdateStatus={handleUpdateOrderStatus}
              page={orderPage}
              setPage={setOrderPage}
              totalPages={totalOrderPages}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          )}

          {/* Blog Tab */}
          {activeTab === "blog" && (
            <BlogTab
              posts={blogPosts}
              loading={blogLoading}
              onAdd={() => {
                setBlogEditingId(null);
                setBlogForm(initialBlogForm());
                setIsBlogModalOpen(true);
              }}
              onEdit={handleBlogEdit}
              onDelete={handleBlogDelete}
            />
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <AnalyticsTab orders={orders} orderStats={orderStats} />
          )}
        </div>
      </main>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={resetForm}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        message={message}
        isEditing={!!editingId}
      />

      {/* Blog Modal */}
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={resetBlogForm}
        form={blogForm}
        onChange={handleBlogChange}
        onSubmit={handleBlogSubmit}
        loading={blogLoading}
        isEditing={!!blogEditingId}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        loading={orderLoading}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

// ==================== DASHBOARD OVERVIEW ====================
function DashboardOverview({ orderStats, products, orders, onTabChange }) {
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stockStatus === "low_stock").slice(0, 5);
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`Rs.${orderStats?.totalRevenue?.toFixed(0) || 0}`}
          icon={DollarSign}
          trend="+12.5%"
          trendUp={true}
          color="emerald"
        />
        <StatCard
          title="Total Orders"
          value={orderStats?.total || 0}
          icon={ShoppingBag}
          trend="+8.2%"
          trendUp={true}
          color="blue"
        />
        <StatCard
          title="Products"
          value={products.length}
          icon={Package}
          trend="New"
          trendUp={true}
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={orderStats?.pending || 0}
          icon={Clock}
          trend="Needs attention"
          trendUp={false}
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <button
              onClick={() => onTabChange("orders")}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{order.orderNumber}</p>
                      <p className="text-sm text-slate-500">{order.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">Rs.{order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">No recent orders</div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Low Stock Alert
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product._id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/40"}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-800 text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <span className="text-amber-600 font-semibold text-sm">{product.stock} left</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-slate-500">No low stock items</div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Preview */}
      {featuredProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Featured Products</h3>
            <button
              onClick={() => onTabChange("products")}
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Manage Products
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/200"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-medium text-slate-800 text-sm line-clamp-1">{product.name}</p>
                <p className="text-pink-600 font-semibold">Rs.{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className={`text-xs mt-2 font-medium ${trendUp ? "text-emerald-600" : "text-amber-600"}`}>
            {trend}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ==================== PRODUCTS TAB ====================
function ProductsTab({ products, search, setSearch, filter, setFilter, onAdd, onEdit, onDelete }) {
  const filters = [
    { id: "all", label: "All Products" },
    { id: "featured", label: "Featured" },
    { id: "low-stock", label: "Low Stock" },
    { id: "out-of-stock", label: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f.id
                    ? "bg-slate-800 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No products found</p>
          <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  const finalPrice = product.finalPrice ?? product.price;
  const avgRating = Number(product.averageRating || 0).toFixed(1);

  const stockStatusConfig = {
    in_stock: { color: "bg-emerald-500", label: `In Stock (${product.stock})`, bg: "bg-emerald-50 text-emerald-700" },
    low_stock: { color: "bg-amber-500", label: `Low Stock (${product.stock})`, bg: "bg-amber-50 text-amber-700" },
    out_of_stock: { color: "bg-red-500", label: "Out of Stock", bg: "bg-red-50 text-red-700" },
  };
  const stockConfig = stockStatusConfig[product.stockStatus] || stockStatusConfig.in_stock;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {product.videoUrl ? (
          <video
            src={product.videoUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={product.imageUrl || undefined}
          />
        ) : (
          <img
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-lg shadow-lg">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {product.promotionBadge && (
            <span className="inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold rounded-lg">
              <Tag className="w-3 h-3 mr-1" />
              {product.promotionBadge}
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${stockConfig.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stockConfig.color} ${product.stockStatus === "low_stock" ? "animate-pulse" : ""}`} />
            {stockConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-800 line-clamp-1">{product.name}</h3>
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{product.description}</p>
        
        <p className="text-xs text-slate-400 mb-4">{product.category}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          {product.isDiscountActive && product.discountPercentage > 0 ? (
            <>
              <span className="text-xl font-bold text-slate-800">Rs.{finalPrice.toFixed(2)}</span>
              <span className="text-sm text-slate-400 line-through">Rs.{product.price}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {product.discountPercentage}% OFF
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-slate-800">Rs.{product.price}</span>
          )}
        </div>

        {/* Rating & Sales */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            {avgRating} ({product.ratingCount || 0})
          </span>
          {product.totalSold > 0 && (
            <span className="text-emerald-600 font-medium">{product.totalSold} sold</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== ORDERS TAB ====================
function OrdersTab({
  orders,
  orderStats,
  statusFilter,
  setStatusFilter,
  onView,
  page,
  setPage,
  totalPages,
  getStatusColor,
  getStatusIcon,
}) {
  const statuses = ["all", "pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {orderStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-slate-800">{orderStats.total}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
            <p className="text-sm text-amber-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-700">{orderStats.pending}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
            <p className="text-sm text-emerald-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-emerald-700">{orderStats.delivered}</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Revenue</p>
            <p className="text-2xl font-bold text-blue-700">Rs.{orderStats.totalRevenue?.toFixed(0) || 0}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              statusFilter === status
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-slate-800">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800">{order.customerInfo.name}</p>
                          <p className="text-sm text-slate-500">{order.customerInfo.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {moment(order.createdAt).tz("Asia/Karachi").format("MMM DD, YYYY")}
                        <p className="text-xs text-slate-400">
                          {moment(order.createdAt).tz("Asia/Karachi").format("h:mm A")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-800">Rs.{order.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onView(order)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== BLOG TAB ====================
function BlogTab({ posts, loading, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-sm text-slate-500">Total Posts: </span>
            <span className="font-semibold text-slate-800">{posts.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span className="text-sm text-slate-500">Published: </span>
            <span className="font-semibold text-emerald-600">
              {posts.filter((p) => p.status === "published").length}
            </span>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl shadow animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              {post.coverImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === "published"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {post.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    {moment(post.updatedAt).tz("Asia/Karachi").format("MMM DD, YYYY")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">{post.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{post.summary}</p>
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-slate-400">+{post.tags.length - 3}</span>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(post)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(post._id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No blog posts yet</p>
          <p className="text-slate-400 text-sm mb-4">Share your first story with your customers</p>
          <button
            onClick={onAdd}
            className="px-6 py-2 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition"
          >
            Create First Post
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== ANALYTICS TAB ====================
function AnalyticsTab({ orders, orderStats }) {
  const statusData = orderStats
    ? [
        { name: "Pending", value: orderStats.pending, color: "#f59e0b" },
        { name: "Confirmed", value: orderStats.confirmed, color: "#3b82f6" },
        { name: "Processing", value: orderStats.processing, color: "#a855f7" },
        { name: "Dispatched", value: orderStats.dispatched, color: "#6366f1" },
        { name: "Delivered", value: orderStats.delivered, color: "#10b981" },
        { name: "Cancelled", value: orderStats.cancelled, color: "#ef4444" },
      ].filter((d) => d.value > 0)
    : [];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = moment().subtract(i, "days").format("YYYY-MM-DD");
    return {
      date: moment(date).format("MMM DD"),
      fullDate: date,
      revenue: 0,
      orders: 0,
    };
  }).reverse();

  orders?.forEach((order) => {
    const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
    const dayData = last7Days.find((d) => d.fullDate === orderDate);
    if (dayData && order.status === "delivered") {
      dayData.revenue += order.totalAmount;
    }
    if (dayData) {
      dayData.orders += 1;
    }
  });

  const categoryData = {};
  orders?.forEach((order) => {
    order.items?.forEach((item) => {
      if (item.category) {
        categoryData[item.category] = (categoryData[item.category] || 0) + item.quantity;
      }
    });
  });

  const topCategories = Object.entries(categoryData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const categoryColors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {orderStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-5 text-white shadow-lg shadow-pink-500/25">
            <p className="text-pink-100 text-sm mb-1">Total Revenue</p>
            <p className="text-2xl font-bold">Rs.{orderStats.totalRevenue?.toFixed(0) || 0}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-slate-800">{orderStats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm mb-1">Delivered</p>
            <p className="text-2xl font-bold text-emerald-600">{orderStats.delivered}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{orderStats.pending}</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`Rs.${value}`, "Revenue"]}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="revenue" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Orders Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Selling Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12, fill: "#64748b" }}
                width={100}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ==================== MODALS ====================
function ProductModal({ isOpen, onClose, form, onChange, onSubmit, loading, message, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <form id="product-form" onSubmit={onSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Basic Information</h3>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
                <input
                  list="categories"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <datalist id="categories">
                <option value="Polaroids" />
                <option value="Frames" />
                <option value="Midnight Surprise" />
                <option value="Acrylic Boxies" />
                <option value="Eid Collection" />
                <option value="Gift Boxes" />
                <option value="Bouquets" />
              </datalist>
            </div>

            {/* Media */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Media</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-pink-300 transition">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={onChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                  />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-pink-300 transition">
                  <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={onChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                  />
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Inventory</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={form.stock}
                    onChange={onChange}
                    min="0"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Low Stock Alert</label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    placeholder="5"
                    value={form.lowStockThreshold}
                    onChange={onChange}
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Discount</h3>
              <input
                type="number"
                name="discountPercentage"
                placeholder="Discount %"
                value={form.discountPercentage}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="discountStart"
                    value={form.discountStart}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="discountEnd"
                    value={form.discountEnd}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Promotion */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Promotion</h3>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={onChange}
                  className="w-5 h-5 text-pink-500 border-slate-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="isFeatured" className="text-slate-700 font-medium">
                  Featured Product
                </label>
              </div>
              <input
                type="text"
                name="promotionBadge"
                placeholder="Promotion Badge (e.g. Bundle Deal)"
                value={form.promotionBadge}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <input
                type="text"
                name="promoCode"
                placeholder="Promo Code"
                value={form.promoCode}
                onChange={onChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent uppercase"
              />
              <textarea
                name="promoDescription"
                placeholder="Promotion description"
                value={form.promoDescription}
                onChange={onChange}
                rows={2}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
              <div>
                <label className="block text-sm text-slate-600 mb-1">Promo Expiry</label>
                <input
                  type="datetime-local"
                  name="promoExpiresAt"
                  value={form.promoExpiresAt}
                  onChange={onChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bundle */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Bundle Items</h3>
              <textarea
                name="bundleItemsInput"
                placeholder="Bundle items (one per line)"
                value={form.bundleItemsInput}
                onChange={onChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-xl ${message.includes("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? "Update Product" : "Add Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogModal({ isOpen, onClose, form, onChange, onSubmit, loading, isEditing }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditing ? "Edit Blog Post" : "Create Blog Post"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={form.title}
            onChange={onChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
          <textarea
            name="summary"
            placeholder="Short summary"
            value={form.summary}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
          <textarea
            name="content"
            placeholder="Story content (supports HTML)"
            value={form.content}
            onChange={onChange}
            rows={8}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm resize-none"
          />
          <input
            type="text"
            name="coverImage"
            placeholder="Cover image URL (optional)"
            value={form.coverImage}
            onChange={onChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <input
              type="number"
              name="readingMinutes"
              placeholder="Reading time (minutes)"
              value={form.readingMinutes}
              onChange={onChange}
              min={1}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <textarea
            name="tagsInput"
            placeholder="Tags (comma separated)"
            value={form.tagsInput}
            onChange={onChange}
            rows={2}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="seoTitle"
              placeholder="SEO Title (optional)"
              value={form.seoTitle}
              onChange={onChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="text"
              name="seoDescription"
              placeholder="SEO Description (optional)"
              value={form.seoDescription}
              onChange={onChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEditing ? "Update Post" : "Publish Post"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OrderModal({ isOpen, onClose, order, onUpdateStatus, loading, getStatusColor }) {
  if (!isOpen || !order) return null;

  const statuses = ["confirmed", "processing", "dispatched", "delivered", "cancelled"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Order Details</h2>
            <p className="text-sm text-slate-500 font-mono">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Timeline */}
          <OrderTimeline status={order.status} updatedAt={order.updatedAt} />

          {/* Customer Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-500">Name:</span> <span className="font-medium">{order.customerInfo.name}</span></p>
              <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{order.customerInfo.phone}</span></p>
              <p><span className="text-slate-500">Address:</span> <span className="font-medium">{order.customerInfo.address}</span></p>
              {order.customerInfo.email && (
                <p><span className="text-slate-500">Email:</span> <span className="font-medium">{order.customerInfo.email}</span></p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    {item.category && (
                      <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                    <p className="text-sm text-slate-500">Qty: {item.quantity} × Rs.{item.price}</p>
                  </div>
                  <p className="font-semibold text-slate-800">Rs.{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Payment Information</h3>
            <p className="text-sm capitalize"><span className="text-slate-500">Method:</span> <span className="font-medium">{order.paymentInfo.method}</span></p>
            {order.paymentInfo.screenshotUrl && (
              <a
                href={order.paymentInfo.screenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:underline"
              >
                <ImageIcon className="w-4 h-4" />
                View Payment Screenshot
              </a>
            )}
          </div>

          {/* Status Update */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order._id, status)}
                  disabled={loading || order.status === status}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    order.status === status
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  } disabled:opacity-50 capitalize`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-800">Total Amount</span>
            <span className="text-2xl font-bold text-emerald-600">Rs.{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
