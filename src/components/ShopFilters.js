"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export default function ShopFilters({ categories, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
    if (onClose) onClose();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams({ q: search });
  }

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentAvailability = searchParams.get("availability") || "";

  return (
    <div className="space-y-7">
      {onClose && (
        <div className="flex items-center justify-between md:hidden">
          <h3 className="font-display font-semibold text-lg">Filters</h3>
          <button type="button" onClick={onClose} className="cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <label className="block text-xs uppercase tracking-widest text-ink-600 font-medium mb-2.5">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-cream-200 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ink-900"
        />
      </form>

      {/* Sort */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-600 font-medium mb-2.5">
          Sort By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full border border-cream-200 rounded-lg px-3.5 py-2.5 text-sm bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-ink-900"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-600 font-medium mb-2.5">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams({ category: "" })}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              currentCategory === ""
                ? "bg-ink-900 text-white border-ink-900"
                : "border-cream-200 text-ink-700 hover:border-ink-900"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParams({ category: cat.slug })}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                currentCategory === cat.slug
                  ? "bg-ink-900 text-white border-ink-900"
                  : "border-cream-200 text-ink-700 hover:border-ink-900"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-ink-600 font-medium mb-2.5">
          Availability
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateParams({ availability: "" })}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              currentAvailability === ""
                ? "bg-ink-900 text-white border-ink-900"
                : "border-cream-200 text-ink-700 hover:border-ink-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => updateParams({ availability: "in-stock" })}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
              currentAvailability === "in-stock"
                ? "bg-ink-900 text-white border-ink-900"
                : "border-cream-200 text-ink-700 hover:border-ink-900"
            }`}
          >
            In Stock
          </button>
        </div>
      </div>
    </div>
  );
}