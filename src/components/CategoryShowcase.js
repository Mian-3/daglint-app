"use client";

import { useState } from "react";
import Link from "next/link";

export default function CategoryShowcase({ parentCategories }) {
  const [activeParent, setActiveParent] = useState(parentCategories[0]?.id);

  const active = parentCategories.find((p) => p.id === activeParent);
  const children = active?.children || [];

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-6 border-b border-cream-200">
        <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink-900">
          Shop by Category
        </h2>
        <div className="flex items-center gap-6">
          {parentCategories.map((parent) => (
            <button
              key={parent.id}
              type="button"
              onClick={() => setActiveParent(parent.id)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors duration-300 cursor-pointer ${
                activeParent === parent.id
                  ? "border-ink-900 text-ink-900"
                  : "border-transparent text-ink-600 hover:text-ink-900"
              }`}
            >
              {parent.name}
            </button>
          ))}
        </div>
      </div>

      <div
        key={activeParent}
        className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 py-6 animate-fade-slide-up"
      >
        {children.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-white/95 py-4 text-center">
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide text-ink-900">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-[11px] uppercase tracking-wide text-ink-600 mt-0.5">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}