"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

export default function ProductGrid({ initialProducts, initialHasMore }) {
  const searchParams = useSearchParams();
  const [batches, setBatches] = useState([initialProducts]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const filterKey = searchParams.toString();

  // Reset when filters change
  useEffect(() => {
    setBatches([initialProducts]);
    setPage(1);
    setHasMore(initialHasMore);
  }, [filterKey, initialProducts, initialHasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page + 1);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setBatches((prev) => [...prev, data.products]);
      setPage((p) => p + 1);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadMore]);

  const allProducts = batches.flat();

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-cream-200 rounded-xl">
        <p className="text-ink-600 text-sm">
          No products found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7">
        {batches.map((batch, batchIndex) =>
          batch.map((product) => (
            <div
              key={product.id}
              className={batchIndex > 0 ? "animate-fade-slide-up" : ""}
            >
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      <div ref={sentinelRef} className="h-10" />

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-ink-600 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading more products...
        </div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <p className="text-center text-xs text-ink-600 py-8">
          You&apos;ve reached the end.
        </p>
      )}
    </div>
  );
}