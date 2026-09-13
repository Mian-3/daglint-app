"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }) {
  const scrollRef = useRef(null);

  function scroll(direction) {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 260;
    const scrollAmount = cardWidth + 24; // card width + gap
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (!products || products.length === 0) {
    return <p className="text-ink-600 text-sm">No products to show.</p>;
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[45%] sm:w-[32%] md:w-[24%] lg:w-[22%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Desktop arrow controls */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex items-center justify-center absolute -left-4 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-cream-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-cream-50 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex items-center justify-center absolute -right-4 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-cream-200 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-cream-50 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}