// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();

  // Calculate total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 sm:p-6 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-pink-700 text-center drop-shadow-sm">
        🌸 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-base sm:text-lg bg-white/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md">
          Your cart is empty. 🛒
        </p>
      ) : (
        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          {cartItems.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center bg-white/90 shadow-lg rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-pink-200 hover:shadow-xl transition"
            >
              {/* Image */}
              <img
                src={item.image || item.imageUrl || (item.images?.[0] ?? "")}
                alt={item.name}
                className="w-full sm:w-28 h-32 sm:h-28 rounded-xl object-cover border-2 border-pink-300 mb-3 sm:mb-0"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=No+Image")
                }
              />

              {/* Details */}
              <div className="flex-1 w-full sm:ml-4 sm:mr-4">
                <h2 className="text-base sm:text-xl font-semibold text-pink-800 line-clamp-1 mb-1">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-2 sm:mb-0">Rs.{item.price}</p>

                {/* Quantity Controls - Below image on mobile, inline on desktop */}
                <div className="flex items-center mt-2 sm:mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item._id || item.id, item.quantity - 1)
                    }
                    className="px-2 sm:px-3 py-1 bg-pink-200 text-pink-800 rounded-l-lg hover:bg-pink-300 transition text-sm"
                  >
                    ➖
                  </button>
                  <span className="px-3 sm:px-5 py-1 bg-pink-50 text-pink-700 font-medium text-sm sm:text-base">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id || item.id, item.quantity + 1)
                    }
                    className="px-2 sm:px-3 py-1 bg-pink-200 text-pink-800 rounded-r-lg hover:bg-pink-300 transition text-sm"
                  >
                    ➕
                  </button>
                </div>
              </div>

              {/* Price + Remove */}
              <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto sm:items-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-pink-100">
                <p className="font-bold text-base sm:text-lg text-pink-700">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="text-xs sm:text-sm text-red-500 hover:text-red-600 transition sm:mt-3"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Section */}
      <div className="mt-6 sm:mt-8 max-w-3xl mx-auto p-4 sm:p-6 bg-white/90 rounded-xl sm:rounded-2xl shadow-lg border border-pink-200 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-pink-700">Total:</h2>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">
          Rs.{totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 sm:mt-8 max-w-3xl mx-auto">
        <button
          onClick={() => {
            if (isEmpty) return alert("Your cart is empty. Please add products before checkout.");
            navigate("/checkout");
          }}
          disabled={isEmpty}
          className={`w-full py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-md transition transform ${
            isEmpty
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 hover:scale-[1.02]"
          }`}
        >
          ✅ Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
