"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { calculateShipping, getAmountLeftForFreeShipping } from "@/lib/orderCalculations";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      setForm((f) => ({
        ...f,
        fullName: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [status, session]);

  useEffect(() => {
    fetchCart();
  }, [status]);

  async function fetchCart() {
    setLoadingCart(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCart(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim() || !form.phone.trim() || !form.addressLine.trim() || !form.city.trim() || !form.postalCode.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const shipping = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shipping;

  if (loadingCart || status === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-ink-600 text-sm">
        Loading checkout...
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display font-semibold mb-3">Checkout</h1>
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
      <h1 className="text-2xl font-display font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-sm mb-2">Shipping Information</h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="03XXXXXXXXX"
              className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="For order updates (optional)"
              className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              required
              className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Postal Code <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Order Notes <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="border border-cream-200 rounded-md p-4 bg-cream-50">
            <p className="text-sm font-medium">Payment Method</p>
            <p className="text-sm text-ink-600 mt-1">Cash on Delivery (COD)</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink-900 text-white py-3 rounded-md text-sm font-medium hover:bg-black disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="border border-cream-200 rounded-lg p-6 h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  Rs. {item.lineTotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-2 border-t border-cream-200 pt-3">
            <span className="text-ink-600">Subtotal</span>
            <span className="font-medium">Rs. {cart.subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-600">Shipping</span>
            {shipping === 0 ? (
              <span className="font-medium text-green-600">Free</span>
            ) : (
              <span className="font-medium">Rs. {shipping.toLocaleString()}</span>
            )}
          </div>

          {shipping > 0 && (
            <p className="text-xs text-ink-600 bg-cream-100 rounded-md px-3 py-2 mb-2">
              Add Rs. {getAmountLeftForFreeShipping(cart.subtotal).toLocaleString()} more to get free shipping!
            </p>
          )}

          <div className="flex justify-between text-sm font-semibold border-t border-cream-200 pt-3">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}