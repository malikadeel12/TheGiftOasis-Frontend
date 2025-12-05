import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/api";
import { jwtDecode } from "jwt-decode";

// Use same base URL logic as api.js
const getApiBase = () => {
  // Vite uses import.meta.env.DEV or import.meta.env.MODE === 'development'
  const isDev = import.meta.env.DEV || import.meta.env.MODE === "development";
  
  if (isDev) {
    return "http://localhost:5000"; // ✅ local testing (without /api)
  }
  // For production, use the base URL without /api (we'll add it in the route)
  return import.meta.env.VITE_API_BASE_URL || "https://api.thegiftoasis.store"; // Live domain
};

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "923295108102";

const CheckoutPage = ({ cartItems, totalPrice, clearCart }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("easypaisa");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isEmpty = !cartItems || cartItems.length === 0;

  // Guard: if cart is empty, redirect back to cart
  useEffect(() => {
    if (isEmpty) {
      alert("Your cart is empty. Please add products before checkout.");
      navigate("/cart", { replace: true });
    }
  }, [isEmpty, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first to place an order.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      if (decoded?.email) {
        setCustomerEmail(decoded.email);
      }
    } catch (err) {
      console.warn("Failed to decode token for checkout:", err);
      alert("Please log in again to place an order.");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const uploadScreenshot = async () => {
    if (!screenshot) return null;
    try {
      const form = new FormData();
      form.append("file", screenshot);
      
      const apiBase = getApiBase();
      const uploadUrl = `${apiBase}/api/upload`; // ✅ Correct path
      
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload error response:", errorText);
        throw new Error(`Screenshot upload failed: ${res.status}`);
      }
      
      const data = await res.json();
      return data.url; // Cloudinary public URL
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmpty || !isAuthenticated) return; // extra safety
    try {
      setLoading(true);

      const formData = new FormData(e.target);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const address = formData.get("address");

      // 1) Upload screenshot (get public URL)
      const screenshotUrl = await uploadScreenshot();

      // 2) Prepare order items for database
      const orderItems = cartItems.map((item) => ({
        productId: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image || item.imageUrl || "",
      }));

      // 3) Create order in database
      const orderData = {
        customerInfo: {
          name,
          email: email || undefined,
          phone,
          address,
        },
        items: orderItems,
        paymentInfo: {
          method: paymentMethod,
          screenshotUrl: screenshotUrl || "",
        },
        totalAmount: totalPrice,
      };

      console.log("📦 Order data being sent:", JSON.stringify(orderData, null, 2));
      
      const orderResponse = await createOrder(orderData);
      console.log("📥 Full order response:", orderResponse);
      console.log("📥 Response data:", orderResponse.data);
      
      // Check if order exists in response
      if (!orderResponse.data || !orderResponse.data.order) {
        throw new Error("Invalid response from server - order data missing");
      }
      
      const order = orderResponse.data.order;
      console.log("✅ Order created successfully:", order);
      
      // Validate required fields
      if (!order.orderNumber) {
        console.error("❌ Order number missing in response:", order);
        throw new Error("Order created but order number is missing");
      }

      // 4) Build order summary for WhatsApp (optional)
      const orderText =
        cartItems.length > 0
          ? cartItems
            .map(
              (item) =>
                `${item.name} x ${item.quantity} = Rs.${(
                  item.price * item.quantity
                ).toFixed(2)}`
            )
            .join("\n")
          : "No items";

      // 5) Payment account numbers
      const accounts = {
        easypaisa: "03255313675 (Title: KHANSA FAHEEM)",
        bank: "08240111941210 (Meezan Bank, IBAN: PK32MEZN0008240111941210)",
      };

      // 6) WhatsApp text with Order Number
      const message = `
🛍️ *New Order Received*
———————————————
🆔 Order Number: ${order.orderNumber}

👤 Name: ${name}
📞 Phone: ${phone}
🏠 Address: ${address}

💳 Payment Method: ${paymentMethod.toUpperCase()}
🔢 Pay To: ${accounts[paymentMethod]}

📦 Order:
${orderText}

💵 Total: Rs.${totalPrice.toFixed(2)}
${screenshotUrl
          ? `\n📷 Payment Screenshot:\n${screenshotUrl}\n`
          : "\n📷 Payment Screenshot: (not uploaded)\n"
        }
*Note:* Please confirm receipt and process the order.
      `.trim();

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

      // 7) Clear cart
      if (clearCart) {
        clearCart();
      }

      // 8) Prepare navigation state
      const navigationState = {
        orderNumber: order.orderNumber,
        orderId: order._id,
        totalAmount: totalPrice,
        customerName: name,
      };
      
      console.log("🧭 Navigating to success page with:", navigationState);
      
      // Small delay to ensure state is set properly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to success page
      navigate("/order-success", {
        state: navigationState,
        replace: true,
      });
      
      console.log("✅ Navigation triggered");
      
      // 9) Open WhatsApp in new tab (after navigation)
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1500);
    } catch (err) {
      console.error("❌ Order creation error:", err);
      console.error("❌ Error response:", err.response?.data);
      console.error("❌ Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        "Something went wrong while placing the order. Please try again.";
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">
        🛍️ Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Left: Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-6 rounded-2xl shadow-lg"
        >
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            className="w-full p-3 border rounded-xl"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <input
            name="phone"
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 border rounded-xl"
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            className="w-full p-3 border rounded-xl"
            required
          />

          <h2 className="text-lg font-bold text-pink-700 mt-4">
            Payment Method
          </h2>
          <div className="space-y-3">

            <label className="block p-3 border rounded-xl cursor-pointer hover:bg-pink-50">
              <input
                type="radio"
                name="payment"
                value="easypaisa"
                checked={paymentMethod === "easypaisa"}
                onChange={() => setPaymentMethod("easypaisa")}
              />{" "}
              <span className="font-semibold">Easypaisa</span> –{" "}
              <span className="text-green-700 ml-1">
                03255313675  (Title: KHANSA FAHEEM)
              </span>
            </label>

            <label className="block p-3 border rounded-xl cursor-pointer hover:bg-pink-50">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />{" "}
              <span className="font-semibold">Bank Transfer</span> –{" "}
              <div className="text-green-700 space-y-1">
                <div>
                  <span className="font-semibold">Account Number:</span> 08240111941210
                </div>
                <div>
                  <span className="font-semibold">IBAN:</span> PK32MEZN0008240111941210
                </div>
                <div>
                  (Meezan Bank)
                </div>
              </div>

            </label>
          </div>

          {/* Upload Screenshot */}
          <div className="mt-2">
            <label className="block mb-2 font-semibold">
              Upload Payment Screenshot:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Allowed: JPG/PNG/WebP • Max 5MB
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || isEmpty}
            className="w-full py-3 mt-6 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-500 transition"
          >
            {loading ? "Processing..." : "✅ Order Now"}
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-pink-700 mb-4">Order Summary</h2>
          {cartItems?.length ? (
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-pink-700">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Your cart is empty.</p>
          )}
          <div className="flex justify-between font-bold text-lg mt-6 border-t pt-4">
            <span>Total:</span>
            <span className="text-green-600">Rs.{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
