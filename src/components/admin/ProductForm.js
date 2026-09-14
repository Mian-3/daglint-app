"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

export default function ProductForm({ categories, initialData }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price || "",
    compareAtPrice: initialData?.compareAtPrice || "",
    sku: initialData?.sku || "",
    stock: initialData?.stock ?? "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive ?? true,
    shippingInfo: initialData?.shippingInfo || "",
    returnPolicy: initialData?.returnPolicy || "",
  });

  const [images, setImages] = useState(
    initialData?.images?.map((img) => img.url) || [""]
  );

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleNameChange(e) {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug: isEditing ? form.slug : autoSlug });
  }

  function updateImage(index, value) {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  }

  function addImageField() {
    setImages([...images, ""]);
  }

  function removeImageField(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
      stock: parseInt(form.stock) || 0,
      images: images.filter((url) => url.trim() !== ""),
    };

    try {
      const url = isEditing ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
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

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setSubmitting(true);
    try {
      await fetch(`/api/admin/products/${initialData.id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Could not delete product.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleNameChange}
            required
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Pricing & Inventory</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Compare-at Price <span className="text-ink-600 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              name="compareAtPrice"
              value={form.compareAtPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent ? `${cat.parent.name} / ${cat.name}` : cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="cursor-pointer"
            />
            Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="cursor-pointer"
            />
            Active (visible on store)
          </label>
        </div>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-sm">Product Images</h2>
        <p className="text-xs text-ink-600">
          Upload one or more images for this product.
        </p>
        <ImageUploader images={images} onChange={setImages} multiple={true} />
      </div>

      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Shipping & Returns (optional)</h2>
        <p className="text-xs text-ink-600">
          Leave blank to use the store&apos;s default shipping and return policy text.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">Shipping Information</label>
          <textarea
            name="shippingInfo"
            value={form.shippingInfo}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. Ships within 2 business days from Karachi."
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Return Policy</label>
          <textarea
            name="returnPolicy"
            value={form.returnPolicy}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. This item is final sale and cannot be returned."
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
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
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="text-red-600 text-sm font-medium hover:underline cursor-pointer"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}