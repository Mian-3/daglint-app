"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function MobileStickyBar({ product }) {
  const router = useRouter();
  const { refreshCart, openDrawer } = useCart();
  const [loading, setLoading] = useState(false);

  const outOfStock = product.stock <= 0;

  async function handleAddToCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (res.ok) {
        refreshCart();
        openDrawer();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 px-4 py-3 flex items-center gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex-1">
        <p className="text-xs text-ink-600">Price</p>
        <p className="text-sm font-semibold text-ink-900">
          Rs. {product.price.toLocaleString()}
        </p>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock || loading}
        className="flex-1 bg-ink-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-black disabled:opacity-40 cursor-pointer"
      >
        {loading ? "Adding..." : outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}