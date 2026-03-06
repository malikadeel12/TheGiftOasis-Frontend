// src/pages/Cart.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, ShieldCheck, Truck } from "lucide-react";

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isEmpty = cartItems.length === 0;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8 sm:py-12 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e34f4d] to-pink-600 flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Shopping Cart</h1>
              {!isEmpty && (
                <p className="text-gray-500 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
              )}
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-pink-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#e34f4d] hover:bg-[#c94543] text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <Package className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-5 flex gap-4 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-24 sm:w-32 h-24 sm:h-32 flex-shrink-0">
                    <img
                      src={item.image || item.imageUrl || (item.images?.[0] ?? "")}
                      alt={item.name}
                      className="w-full h-full rounded-xl object-cover border border-pink-100"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=No+Image")
                      }
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item._id || item.id}`}>
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1 hover:text-[#e34f4d] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-3">Rs.{item.price} each</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border-2 border-pink-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item._id || item.id, item.quantity - 1)
                          }
                          className="w-10 h-10 flex items-center justify-center bg-pink-50 hover:bg-pink-100 text-[#e34f4d] transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id || item.id, item.quantity + 1)
                          }
                          className="w-10 h-10 flex items-center justify-center bg-pink-50 hover:bg-pink-100 text-[#e34f4d] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#e34f4d]">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">Rs.{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="font-medium text-amber-600">
                      Calculated at checkout
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3"></div>
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Subtotal</span>
                    <span className="text-[#e34f4d]">Rs.{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    *Shipping charges will be calculated and confirmed on WhatsApp after order placement
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-[#e34f4d] hover:bg-[#c94543] text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
