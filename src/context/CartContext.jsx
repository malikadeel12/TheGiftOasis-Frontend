// src/context/CartContext.jsx
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Debug log every render
  console.log("🛒 CartContext Rendered => cartItems:", cartItems);

  const addToCart = (product) => {
    const productId = product.id || product._id; // ✅ handle both id and _id
    console.log("➕ Adding to cart =>", product);

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === productId);

      if (existingItem) {
        console.log("🔄 Updating existing item:", existingItem);
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        console.log("🆕 Adding new item:", productId);
        return [
          ...prev,
          {
            id: productId, // ✅ consistent ID
            name: product.name,
            price: product.price,
            image:
              product.images?.[0] || product.imageUrl || product.image, // ✅ safe image
            quantity: 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    console.log("❌ Removing item from cart =>", id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    console.log("✏️ Update quantity =>", { id, quantity });
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
