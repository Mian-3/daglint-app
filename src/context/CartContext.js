"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (status !== "loading") {
      refreshCart();
    }
  }, [status, refreshCart]);

  // Optimistic update: change the UI instantly, then sync with the server in the background
  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, lineTotal: item.price * newQuantity }
          : item
      )
    );
    setSubtotal((prev) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return prev;
      return prev - item.price * item.quantity + item.price * newQuantity;
    });

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) {
        refreshCart(); // roll back to server truth if it failed
      }
    } catch (err) {
      refreshCart();
    }
  }

  async function removeItem(itemId) {
    const removedItem = items.find((i) => i.id === itemId);
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    if (removedItem) {
      setSubtotal((prev) => prev - removedItem.price * removedItem.quantity);
    }

    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (!res.ok) {
        refreshCart();
      }
    } catch (err) {
      refreshCart();
    }
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