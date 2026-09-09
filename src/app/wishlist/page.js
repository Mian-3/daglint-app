"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchWishlist();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  async function fetchWishlist() {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId) {
    await fetch(`/api/wishlist/${itemId}`, { method: "DELETE" });
    fetchWishlist();
  }

  async function moveToCart(productId, itemId) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    await removeItem(itemId);
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-ink-600 text-sm">
        Loading your wishlist...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold mb-3">
          Your Wishlist
        </h1>
        <p className="text-ink-600 text-sm mb-6">
          Please login to view your wishlist.
        </p>
        <Link
          href="/login"
          className="inline-block bg-ink-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-black"
        >
          Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold mb-3">
          Your Wishlist
        </h1>
        <p className="text-ink-600 text-sm mb-6">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="inline-block bg-ink-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-black"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-semibold mb-8">
        Your Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-cream-200 rounded-lg overflow-hidden"
          >
            <Link href={`/products/${item.slug}`}>
              <div className="aspect-square bg-cream-100">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Link>
            <div className="p-4">
              <Link
                href={`/products/${item.slug}`}
                className="text-sm font-medium text-ink-900 hover:underline"
              >
                {item.name}
              </Link>
              <p className="text-sm text-ink-600 mt-1 mb-3">
                Rs. {item.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveToCart(item.productId, item.id)}
                  disabled={item.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-ink-900 text-white text-xs py-2 rounded-md hover:bg-black disabled:bg-cream-200 disabled:text-ink-600"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {item.stock <= 0 ? "Out of Stock" : "Move to Cart"}
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-ink-600 hover:text-red-600"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}