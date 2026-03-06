// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyOrders } from "../services/api";
import { Package, ShoppingBag, ChevronRight, Clock, MapPin, Phone, AlertCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: { 
    color: "text-amber-600", 
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "⏳",
    label: "Pending"
  },
  confirmed: { 
    color: "text-blue-600", 
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "✅",
    label: "Confirmed"
  },
  processing: { 
    color: "text-purple-600", 
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "⚙️",
    label: "Processing"
  },
  dispatched: { 
    color: "text-indigo-600", 
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: "🚚",
    label: "Dispatched"
  },
  delivered: { 
    color: "text-green-600", 
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "🎉",
    label: "Delivered"
  },
  cancelled: { 
    color: "text-red-600", 
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "❌",
    label: "Cancelled"
  },
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return "—";
  }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data?.orders || []);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          navigate("/login", { replace: true });
          return;
        }
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load your orders. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl mb-4">
            <Loader2 className="w-10 h-10 text-[#e34f4d] animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 py-8 sm:py-12 px-4 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e34f4d] to-pink-600 flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Orders</h1>
              <p className="text-gray-500 text-sm">Track and manage your orders</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="text-center bg-white rounded-3xl shadow-xl p-8 sm:p-12">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-pink-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#e34f4d] hover:bg-[#c94543] text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrder === order._id;
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Order Header - Always Visible */}
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${status.bg}`}>
                          {status.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order #{order.orderNumber || order._id.slice(-8)}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <p className="text-2xl font-bold text-[#e34f4d]">
                          Rs.{Number(order.totalAmount || 0).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <span>{isExpanded ? 'Hide' : 'View'} details</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 animate-fade-in">
                      <div className="p-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items ({order.items?.length || 0})</h4>
                        
                        <div className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <div
                              key={`${order._id}-${idx}`}
                              className="flex items-center gap-4 bg-gray-50 rounded-xl p-3"
                            >
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs.{item.price}</p>
                              </div>
                              <p className="font-semibold text-[#e34f4d]">
                                Rs.{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-5 pt-5 border-t border-gray-100">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Shipping Details</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                                <p className="text-sm text-gray-500">{order.shippingAddress || 'Not provided'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Contact</p>
                                <p className="text-sm text-gray-500">{order.phone || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Admin Note</p>
                            <p className="text-sm text-amber-800">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
