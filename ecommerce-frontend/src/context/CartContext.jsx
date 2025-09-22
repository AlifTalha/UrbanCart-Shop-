import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p._id === product._id);
      if (found) {
        return prev.map((p) => p._id === product._id ? { ...p, quantity: p.quantity + qty } : p);
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (productId, qty) => {
    setCart((prev) => prev.map((p) => p._id === productId ? { ...p, quantity: qty } : p));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p._id !== productId));
  };

  const clearCart = () => setCart([]);

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};
