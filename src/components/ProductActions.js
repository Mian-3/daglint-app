"use client";

import { useState } from "react";
import { Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [message, setMessage] = useState("");

  const outOfStock = product.stock <= 0;

  function decrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increase() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  async function handleAddToCart() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Could not add to cart.");
        setLoading(false);
        return;
      }

      setMessage("Added to cart!");
      router.refresh();
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToWishlist() {
    setWishlistLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Could not add to wishlist.");
        setWishlistLoading(false);
        return;
      }

      setMessage("Added to wishlist!");
    } catch (err) {
      setMessage("Something went wrong.");
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={decrease}
            className="p-2 hover:bg-gray-50"
            disabled={outOfStock}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={increase}
            className="p-2 hover:bg-gray-50"
            disabled={outOfStock}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || loading}
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {loading ? "Adding..." : outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={wishlistLoading}
          title="Add to wishlist"
          className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {message && (
        <p className="text-sm text-gray-600 mt-3">{message}</p>
      )}
    </div>
  );
}