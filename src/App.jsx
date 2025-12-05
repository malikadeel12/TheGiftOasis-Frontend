// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import ProductDetails from "./pages/ProductDetails";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function App() {
  // ✅ Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
  const id = product._id || product.id; // universal id
  const priceToUse = product.finalPrice ?? product.price; // use discounted price if available

  setCartItems((prev) => {
    const exist = prev.find((item) => item._id === id);
    if (exist) {
      return prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [
        ...prev,
        { ...product, _id: id, quantity: 1, price: priceToUse },
      ];
    }
  });
};


  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: qty } : item))
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Calculate total for checkout
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Router>
      <Navbar cartItems={cartItems} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/shop" element={<Shop addToCart={addToCart} />} />
        <Route path="/products/:productId" element={<ProductDetails addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage cartItems={cartItems} totalPrice={totalPrice} clearCart={clearCart} />
            </ProtectedRoute>
          }
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
