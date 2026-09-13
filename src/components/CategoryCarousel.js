"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryCarousel({ categories }) {
  const scrollRef = useRef(null);

  function scroll(direction) {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    const scrollAmount = cardWidth + 28;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-6 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group snap-start shrink-0 w-[68%] sm:w-[42%] md:w-[29%] lg:w-[24%]"
          >
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-cream-100">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/10 to-transparent" />

              <span className="absolute top-5 left-5 text-white/60 text-xs font-display italic">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-white/60 text-[10px] uppercase tracking-[0.25em] mb-1.5">
                  Collection
                </p>
                <h3 className="text-white font-display text-xl md:text-2xl mb-2 leading-tight">
                  {category.name}
                </h3>
                <span className="block h-px bg-white/40 w-6 group-hover:w-12 transition-all duration-500 ease-out" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex items-center justify-center absolute -left-5 top-[42%] -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-cream-50 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex items-center justify-center absolute -right-5 top-[42%] -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-cream-50 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}