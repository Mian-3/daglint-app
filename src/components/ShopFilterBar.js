"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function ShopFilterBar({ categories, totalCount }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentAvailability = searchParams.get("availability") || "";

  return (
    <div className="flex items-center justify-between bg-cream-100/60 border border-cream-200 rounded-xl px-5 py-3.5 mb-10 overflow-x-auto">
      <div className="flex items-center gap-6 md:gap-10 shrink-0">
        <FilterDropdown
          label="Availability"
          value={currentAvailability}
          onChange={(v) => updateParams({ availability: v })}
          options={[
            { value: "", label: "All" },
            { value: "in-stock", label: "In Stock" },
          ]}
        />
        <span className="w-px h-4 bg-cream-200 hidden md:block" />
        <FilterDropdown
          label="Category"
          value={currentCategory}
          onChange={(v) => updateParams({ category: v })}
          options={[
            { value: "", label: "All" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6 shrink-0 pl-4">
        <span className="text-xs text-ink-600 whitespace-nowrap">
          {totalCount} items
        </span>
        <span className="w-px h-4 bg-cream-200 hidden md:block" />
        <FilterDropdown
          label="Sort"
          value={currentSort}
          onChange={(v) => updateParams({ sort: v })}
          options={[
            { value: "featured", label: "Featured" },
            { value: "newest", label: "Newest" },
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
          ]}
        />
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs md:text-sm text-ink-600 whitespace-nowrap">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent text-xs md:text-sm text-ink-900 font-medium pr-5 cursor-pointer focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink-600" />
      </div>
    </div>
  );
}