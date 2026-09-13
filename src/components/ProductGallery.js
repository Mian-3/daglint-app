"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";
import Lightbox from "./Lightbox";

export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayImages =
    images && images.length > 0
      ? images
      : [{ url: "https://picsum.photos/seed/placeholder/800/800", altText: productName }];

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails: left column on desktop, horizontal row on mobile */}
      {displayImages.length > 1 && (
        <div className="order-2 md:order-1 flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible">
          {displayImages.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 cursor-pointer transition-colors ${
                index === activeIndex ? "border-ink-900" : "border-cream-200 hover:border-ink-600"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="order-1 md:order-2 group relative flex-1 aspect-square bg-cream-100 rounded-lg overflow-hidden cursor-zoom-in"
      >
        <img
          src={displayImages[activeIndex].url}
          alt={displayImages[activeIndex].altText || productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
          <ZoomIn className="w-4 h-4 text-ink-900" />
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={displayImages}
          activeIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}