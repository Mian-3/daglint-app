"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  function toggle(index) {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  return (
    <div className="divide-y divide-cream-200 border-t border-b border-cream-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
            >
              <span className="font-medium text-sm text-ink-900">{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-ink-600 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-sm text-ink-600 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}