// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";  // 👈 navigate hook import

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate(); // 👈 hook use kiya

  // 💰 Calculate total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-pink-700 text-center drop-shadow-sm">
        🌸 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 text-center text-lg bg-white/60 p-6 rounded-2xl shadow-md">
          Your cart is empty. 🛒
        </p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {cartItems.map((item, index) => (
            <div
              key={item._id || item.id || index}
              className="flex items-center bg-white/90 shadow-lg rounded-2xl p-5 border border-pink-200 hover:shadow-xl transition"
            >
              {/* Image */}
              <img
                src={item.image || item.imageUrl || (item.images?.[0] ?? "")}
                alt={item.name}
                className="w-28 h-28 rounded-xl object-cover border-2 border-pink-300"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=No+Image")
                }
              />

              {/* Details */}
              <div className="ml-5 flex-1">
                <h2 className="text-xl font-semibold text-pink-800">
                  {item.name}
                </h2>
                <p className="text-gray-600">Rs.{item.price}</p>

                {/* Quantity Controls */}
                <div className="flex items-center mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item._id || item.id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-pink-200 text-pink-800 rounded-l-lg hover:bg-pink-300 transition"
                  >
                    ➖
                  </button>
                  <span className="px-5 py-1 bg-pink-50 text-pink-700 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id || item.id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-pink-200 text-pink-800 rounded-r-lg hover:bg-pink-300 transition"
                  >
                    ➕
                  </button>
                </div>
              </div>

              {/* Price + Remove */}
              <div className="flex flex-col items-end">
                <p className="font-bold text-lg text-pink-700">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="mt-3 text-sm text-red-500 hover:text-red-600 transition"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Section */}
      <div className="mt-8 max-w-3xl mx-auto p-6 bg-white/90 rounded-2xl shadow-lg border border-pink-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-pink-700">Total:</h2>
        <p className="text-3xl font-bold text-green-600">
          Rs.{totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/checkout")} // 👈 navigate to checkout
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-lg rounded-2xl shadow-md hover:from-pink-600 hover:to-rose-500 transition transform hover:scale-[1.02]"
        >
          ✅ Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
