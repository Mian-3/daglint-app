"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

export default function CategoryForm({ topLevelCategories, initialData }) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId || "",
  });

  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      ...form,
      parentId: form.parentId || null,
      imageUrl,
    };

    try {
      const url = isEditing ? `/api/admin/categories/${initialData.id}` : "/api/admin/categories";
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

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/categories/${initialData.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not delete category.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError("Could not delete category.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
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
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-ink-600 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parent Group</label>
          <select
            name="parentId"
            value={form.parentId}
            onChange={handleChange}
            className="w-full border border-cream-200 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">— Top Level (e.g. Men, Women, Kids) —</option>
            {topLevelCategories
              .filter((c) => c.id !== initialData?.id)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <p className="text-xs text-ink-600 mt-1">
            Leave as &quot;Top Level&quot; to create a group like Men/Women/Kids. Select a
            group to make this a sub-category.
          </p>
        </div>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-sm">Category Image</h2>
        <ImageUploader images={imageUrl} onChange={setImageUrl} multiple={false} />
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
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting}
            className="text-red-600 text-sm font-medium hover:underline cursor-pointer"
          >
            Delete Category
          </button>
        )}
      </div>
    </form>
  );
}