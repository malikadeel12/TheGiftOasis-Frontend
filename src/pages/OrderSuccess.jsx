import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Phone } from "lucide-react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, orderId, totalAmount, customerName } = location.state || {};

  // Debug: Log state data
  React.useEffect(() => {
    console.log("📄 OrderSuccess - Location state:", location.state);
    console.log("📄 OrderSuccess - Order Number:", orderNumber);
  }, [location.state, orderNumber]);

  // If no order data, show message and redirect after delay
  React.useEffect(() => {
    if (!orderNumber) {
      console.warn("⚠️ No order number found in state, redirecting to home...");
      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Loading order details...</h1>
          <p className="text-gray-600">If this page doesn't load, please go back to the shop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-4">
          🎉 Order Placed Successfully!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Thank you, <span className="font-semibold text-pink-600">{customerName}</span>! Your order has been received.
        </p>

        {/* Order Details Card */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 mb-8 border-2 border-pink-200">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="text-pink-600" size={24} />
              <h2 className="text-xl font-bold text-pink-700">Order Details</h2>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-pink-700 font-mono">{orderNumber}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-green-600">Rs. {totalAmount?.toFixed(2) || "0.00"}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-orange-600">Pending Confirmation</p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-8 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">📋 What's Next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• We've received your order and payment screenshot</li>
            <li>• Our team will verify your payment within 24 hours</li>
            <li>• You'll receive a confirmation via WhatsApp once verified</li>
            <li>• Please save your Order Number: <strong className="font-mono">{orderNumber}</strong></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            Continue Shopping
          </Link>

          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-full font-semibold transition shadow-md hover:shadow-lg"
          >
            <ShoppingBag size={20} />
            Browse More
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Need help? Contact us:</p>
          <a
            href={`https://wa.me/923295108102?text=Hi, I placed an order ${orderNumber}. I need assistance.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
          >
            <Phone size={18} />
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}

