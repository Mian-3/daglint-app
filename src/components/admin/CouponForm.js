"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CouponForm({ initialData }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    code: initialData?.code || "",
    discountType: initialData?.discountType || "PERCENTAGE",
    discountValue: initialData?.discountValue || "",
    minOrderAmount: initialData?.minOrderAmount || "",
    maxDiscount: initialData?.maxDiscount || "",
    usageLimit: initialData?.usageLimit || "",
    expiresAt: initialData?.expiresAt
      ? new Date(initialData.expiresAt).toISOString().split("T")[0]
      : "",
    isActive: initialData?.isActive ?? true,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleCodeChange(e) {
    setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, "") });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...form,
      discountValue: parseFloat(form.discountValue),
      minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
      maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };

    try {
      const url = isEditing ? `/api/admin/coupons/${initialData.id}` : "/api/admin/coupons";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    setSubmitting(true);
    try {
      await fetch(`/api/admin/coupons/${initialData.id}`, { method: "DELETE" });
      router.push("/admin/coupons");
      router.refresh();
    } catch (err) {
      setError("Could not delete coupon.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleCodeChange}
            required
            placeholder="e.g. WELCOME10"
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (Rs.)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Discount Value {form.discountType === "PERCENTAGE" ? "(%)" : "(Rs.)"}
            </label>
            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Minimum Order Amount <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 1000"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {form.discountType === "PERCENTAGE" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Discount Cap <span className="text-ink-600 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={form.maxDiscount}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 500"
                className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Usage Limit <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              min="1"
              placeholder="Unlimited if blank"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Expiry Date <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              name="expiresAt"
              value={form.expiresAt}
              onChange={handleChange}
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="cursor-pointer"
          />
          Active
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Coupon"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="text-red-600 text-sm font-medium hover:underline cursor-pointer"
          >
            Delete Coupon
          </button>
        )}
      </div>
    </form>
  );
}