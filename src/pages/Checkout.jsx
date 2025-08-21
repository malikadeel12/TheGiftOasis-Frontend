import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "923001234567";

const CheckoutPage = ({ cartItems, totalPrice }) => {
  const [paymentMethod, setPaymentMethod] = useState("jazzcash");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const uploadScreenshot = async () => {
    if (!screenshot) return null;
    const form = new FormData();
    form.append("file", screenshot);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Screenshot upload failed");
    const data = await res.json();
    return data.url; // Cloudinary public URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData(e.target);
      const name = formData.get("name");
      const phone = formData.get("phone");
      const address = formData.get("address");

      // 1) Upload screenshot (get public URL)
      const screenshotUrl = await uploadScreenshot();

      // 2) Build order summary
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

      // 3) Payment account numbers (display in message too)
      const accounts = {
        jazzcash: "0300-1234567 (Title: Your Name)",
        easypaisa: "0311-9876543 (Title: Your Name)",
        bank: "PK12-ABCD-1234567890 (Meezan Bank)",
      };

      // 4) WhatsApp text
      const message = `
🛍️ *New Order Received*
———————————————
👤 Name: ${name}
📞 Phone: ${phone}
🏠 Address: ${address}

💳 Payment Method: ${paymentMethod.toUpperCase()}
🔢 Pay To: ${accounts[paymentMethod]}

📦 Order:
${orderText}

💵 Total: Rs.${totalPrice.toFixed(2)}
${
  screenshotUrl
    ? `\n📷 Payment Screenshot:\n${screenshotUrl}\n`
    : "\n📷 Payment Screenshot: (not uploaded)\n"
}
*Note:* Please confirm receipt and process the order.
      `.trim();

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;

      // 5) Open WhatsApp
      window.open(waUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing the order. Please try again.");
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
                value="jazzcash"
                checked={paymentMethod === "jazzcash"}
                onChange={() => setPaymentMethod("jazzcash")}
              />{" "}
              <span className="font-semibold">JazzCash</span> –{" "}
              <span className="text-green-700 ml-1">
                0300-1234567 (Title: Your Name)
              </span>
            </label>

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
                0311-9876543 (Title: Your Name)
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
              <span className="text-green-700 ml-1">
                PK12-ABCD-1234567890 (Meezan Bank)
              </span>
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
            disabled={loading}
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
