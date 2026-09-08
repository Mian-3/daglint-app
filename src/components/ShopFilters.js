"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function ShopFilters({ categories }) {
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

    // Reset to page 1 whenever a filter changes
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams({ q: search });
  }

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentAvailability = searchParams.get("availability") || "";

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <label className="block text-sm font-semibold mb-2">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </form>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold mb-2">Sort By</label>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold mb-2">Category</label>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => updateParams({ category: "" })}
            className={`block text-sm ${
              currentCategory === "" ? "font-semibold text-black" : "text-gray-600"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParams({ category: cat.slug })}
              className={`block text-sm ${
                currentCategory === cat.slug
                  ? "font-semibold text-black"
                  : "text-gray-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-semibold mb-2">Availability</label>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => updateParams({ availability: "" })}
            className={`block text-sm ${
              currentAvailability === "" ? "font-semibold text-black" : "text-gray-600"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => updateParams({ availability: "in-stock" })}
            className={`block text-sm ${
              currentAvailability === "in-stock"
                ? "font-semibold text-black"
                : "text-gray-600"
            }`}
          >
            In Stock
          </button>
        </div>
      </div>
    </div>
  );
}