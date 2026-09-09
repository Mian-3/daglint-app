"use client";

import { useState } from "react";

export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [{ url: "https://picsum.photos/seed/placeholder/800/800", altText: productName }];

  return (
    <div>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
        <img
          src={displayImages[activeIndex].url}
          alt={displayImages[activeIndex].altText || productName}
          className="w-full h-full object-cover"
        />
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2">
          {displayImages.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                index === activeIndex ? "border-black" : "border-transparent"
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
    </div>
  );
}