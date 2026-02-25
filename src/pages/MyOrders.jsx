import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";

const statusColors = {
  pending: "text-yellow-600 bg-yellow-50",
  confirmed: "text-blue-700 bg-blue-50",
  processing: "text-purple-700 bg-purple-50",
  dispatched: "text-indigo-700 bg-indigo-50",
  delivered: "text-green-700 bg-green-50",
  cancelled: "text-red-700 bg-red-50",
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  } catch {
    return "—";
  }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-xl shadow text-pink-600 font-semibold">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-6 sm:py-10 px-3 sm:px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <span role="img" aria-label="box">
            📦
          </span>
          My Orders
        </h1>

        {error && (
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="text-center bg-pink-100 text-pink-700 py-8 sm:py-10 rounded-2xl">
            <p className="text-lg sm:text-xl font-semibold">No orders yet.</p>
            <p className="mt-2 text-sm sm:text-base">Start shopping to see your order history here!</p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 inline-flex items-center gap-2 bg-pink-500 text-white px-4 sm:px-5 py-2 rounded-full shadow hover:bg-pink-600 transition text-sm sm:text-base"
            >
              🛍️ Shop Now
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-pink-100 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b border-pink-100 pb-3 sm:pb-4 mb-3 sm:mb-4">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-base sm:text-xl font-semibold text-pink-700 truncate">
                      Order #{order.orderNumber || order._id.slice(-6)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-2">
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        statusColors[order.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status?.toUpperCase() || "PENDING"}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-green-600">
                      Rs.{Number(order.totalAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={`${order._id}-${idx}`}
                      className="flex items-center justify-between bg-pink-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg object-cover border border-pink-100 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-semibold text-pink-700 text-sm sm:text-base flex-shrink-0 ml-2">
                        Rs.{Number(item.price * item.quantity || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl bg-yellow-50 border border-yellow-200 px-3 sm:px-4 py-2 sm:py-3 text-yellow-700">
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Admin Note</p>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


