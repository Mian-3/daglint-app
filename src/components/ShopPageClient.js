"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ShopFilters from "./ShopFilters";

export default function ShopPageClient({ categories }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden flex items-center gap-2 border border-cream-200 rounded-lg px-4 py-2.5 text-sm font-medium mb-6 cursor-pointer"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <ShopFilters categories={categories} />
      </aside>

      {/* Mobile drawer */}
      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative bg-white w-[85%] max-w-sm h-full ml-auto p-6 overflow-y-auto animate-fade-slide-up">
            <ShopFilters categories={categories} onClose={() => setMobileFiltersOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}