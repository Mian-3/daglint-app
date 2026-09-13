"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { refreshCart, openDrawer } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const image = product.images?.[0]?.url || "https://picsum.photos/seed/placeholder/800/800";
  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;
  const outOfStock = product.stock <= 0;

  async function handleAddToCart(e) {
    e.preventDefault();
    if (outOfStock || addingToCart) return;

    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        refreshCart();
        openDrawer();
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleAddToWishlist(e) {
    e.preventDefault();
    if (addingToWishlist) return;

    setAddingToWishlist(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.status === 401) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Add to wishlist failed:", err);
    } finally {
      setAddingToWishlist(false);
    }
  }

  return (
    <div className="group relative border border-cream-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-cream-100 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1">
              -{discountPercent}%
            </span>
          )}

          {outOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-sm font-semibold text-ink-900 bg-white px-3 py-1 border border-cream-200">
                Out of Stock
              </span>
            </div>
          )}

          <button
            type="button"
            title="Add to wishlist"
            disabled={addingToWishlist}
            onClick={handleAddToWishlist}
            className="absolute top-2 right-2 bg-white p-2 shadow hover:bg-cream-50 cursor-pointer disabled:opacity-50"
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
          disabled={outOfStock || addingToCart}
          onClick={handleAddToCart}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-ink-900 text-white text-xs font-medium py-2 hover:bg-black transition-colors cursor-pointer disabled:bg-cream-200 disabled:text-ink-600 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {outOfStock ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}