"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Free shipping on orders over Rs. 1500",
  "Cash on Delivery available nationwide",
  "7-day easy returns on all orders",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-ink-900 text-white text-xs md:text-sm py-2.5 text-center overflow-hidden">
      <p key={index} className="animate-fade-slide-up">
        {MESSAGES[index]}
      </p>
    </div>
  );
}