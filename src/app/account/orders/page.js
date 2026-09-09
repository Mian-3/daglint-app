"use client";

import { useState } from "react";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setOrder(data.order);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-display font-semibold mb-2">Track Your Order</h1>
      <p className="text-sm text-ink-600 mb-8">
        Enter your order number and phone number to check your order status.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1">Order Number</label>
          <input
            type="text"
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            placeholder="ORD-XXXXXXXXXXXX"
            required
            className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink-900 text-white py-3 rounded-md text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>

      {order && (
        <div className="border border-cream-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-cream-200">
            <span className="font-semibold text-sm">{order.orderNumber}</span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                STATUS_COLORS[order.status] || "bg-cream-100 text-ink-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-ink-600">
                  {item.name} × {item.quantity}
                </span>
                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-200 pt-3 flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>Rs. {order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}