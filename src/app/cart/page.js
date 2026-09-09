"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  async function fetchCart() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;

    await fetch(`/api/cart/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    fetchCart();
  }

  async function removeItem(itemId) {
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    fetchCart();
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-ink-600 text-sm">
        Loading your cart...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold mb-3">Your Cart</h1>
        <p className="text-ink-600 text-sm mb-6">
          Please login to view your cart.
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

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold mb-3">Your Cart</h1>
        <p className="text-ink-600 text-sm mb-6">Your cart is empty.</p>
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
      <h1 className="text-2xl font-display font-semibold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-cream-200 rounded-lg p-4"
            >
              <div className="w-20 h-20 bg-cream-100 rounded-md overflow-hidden flex-shrink-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-medium text-ink-900 hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-ink-600 mt-1">
                  Rs. {item.price.toLocaleString()}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-cream-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-cream-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 hover:bg-cream-50 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-ink-600 hover:text-red-600"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm font-semibold text-ink-900">
                Rs. {item.lineTotal.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-cream-200 rounded-lg p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-600">Subtotal</span>
            <span className="font-medium">Rs. {cart.subtotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-ink-600 mb-4">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="block w-full text-center bg-ink-900 text-white py-3 rounded-md text-sm font-medium hover:bg-black transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}