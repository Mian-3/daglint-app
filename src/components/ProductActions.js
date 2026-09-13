"use client";

import { useState } from "react";
import { Minus, Plus, Heart, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ProductActions({ product }) {
  const router = useRouter();
  const { refreshCart, openDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [message, setMessage] = useState("");

  const outOfStock = product.stock <= 0;

  function decrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increase() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  async function addToCart(qty) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: qty }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Could not add to cart.");
    }
  }

  async function handleAddToCart() {
    setLoading(true);
    setMessage("");
    try {
      await addToCart(quantity);
      setMessage("Added to cart!");
      refreshCart();
      openDrawer();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyNow() {
    setBuyingNow(true);
    setMessage("");
    try {
      await addToCart(quantity);
      await refreshCart();
      router.push("/checkout");
    } catch (err) {
      setMessage(err.message);
      setBuyingNow(false);
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

      if (res.status === 401) {
        router.push("/login");
        return;
      }

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
        <div className="flex items-center border border-cream-200 rounded-md">
          <button
            type="button"
            onClick={decrease}
            className="p-2 hover:bg-cream-50 cursor-pointer"
            disabled={outOfStock}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            onClick={increase}
            className="p-2 hover:bg-cream-50 cursor-pointer"
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
          disabled={outOfStock || loading || buyingNow}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-ink-900 text-ink-900 py-3 rounded-md text-sm font-medium hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={handleAddToWishlist}
          disabled={wishlistLoading}
          title="Add to wishlist"
          className="p-3 border border-cream-200 rounded-md hover:bg-cream-50 cursor-pointer"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={outOfStock || loading || buyingNow}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-ink-900 text-white py-3 rounded-md text-sm font-medium hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Zap className="w-4 h-4" />
        {buyingNow ? "Processing..." : outOfStock ? "Out of Stock" : "Buy Now"}
      </button>

      {message && (
        <p className="text-sm text-ink-600 mt-3">{message}</p>
      )}
    </div>
  );
}