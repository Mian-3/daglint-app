"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.url || "https://picsum.photos/seed/placeholder/800/800";
  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;
  const outOfStock = product.stock <= 0;

  return (
    <div className="group relative border border-cream-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-semibold text-ink-900 bg-white px-3 py-1 rounded-full border border-cream-200">
                Out of Stock
              </span>
            </div>
          )}

          <button
            type="button"
            title="Add to wishlist"
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-cream-50"
            onClick={(e) => {
              e.preventDefault();
              // Wishlist functionality will be added in a later stage
            }}
          >
            <Heart className="w-4 h-4 text-ink-900" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-ink-900 truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-ink-900">
            Rs. {price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-ink-600 line-through">
              Rs. {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={outOfStock}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-ink-900 text-white text-xs font-medium py-2 rounded-md hover:bg-black transition-colors disabled:bg-cream-200 disabled:text-ink-600 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}