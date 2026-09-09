"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (status !== "authenticated") {
      setItems([]);
      setSubtotal(0);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data.items || []);
      setSubtotal(data.subtotal || 0);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    refreshCart();
  }

  async function removeItem(itemId) {
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    refreshCart();
  }

  function openDrawer() {
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        refreshCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}