"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DURATION = 3000;

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title || "Hero slide"}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
              index === current ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-black/25" />

          {slide.title && (
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
              <p
                key={`sub-${current}`}
                className="text-white/90 text-xs md:text-sm uppercase tracking-[0.2em] mb-3 animate-fade-slide-up"
              >
                {slide.eyebrow}
              </p>
              <h1
                key={`title-${current}`}
                className="text-white font-display font-semibold text-4xl md:text-6xl mb-4 animate-fade-slide-up"
                style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
              >
                {slide.title}
              </h1>
              <p
                key={`desc-${current}`}
                className="text-white/85 text-sm md:text-base max-w-md mb-8 animate-fade-slide-up"
                style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
              >
                {slide.subtitle}
              </p>
              <Link
                key={`cta-${current}`}
                href={slide.ctaLink}
                className="animate-fade-slide-up inline-block bg-white text-ink-900 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-cream-100 transition-colors shadow-lg"
                style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
              >
                {slide.ctaText}
              </Link>
            </div>
          )}

          {!slide.title && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
              <Link
                href={slide.ctaLink}
                className="inline-block bg-ink-900 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-black transition-colors shadow-lg"
              >
                {slide.ctaText}
              </Link>
            </div>
          )}
        </div>
      ))}

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots with circular progress ring */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="relative w-4 h-4 flex items-center justify-center cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            {index === current && (
              <svg
                key={`ring-${current}-${isPaused}`}
                className="absolute inset-0 w-4 h-4 -rotate-90"
                viewBox="0 0 16 16"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 6.5}
                  className={isPaused ? "" : "animate-hero-progress"}
                  style={{
                    strokeDashoffset: isPaused ? 2 * Math.PI * 6.5 * 0.999 : undefined,
                  }}
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}