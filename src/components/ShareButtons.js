"use client";

import { MessageCircle, Link2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ productName }) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Check out ${productName}: ${getUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  function shareFacebook() {
    const url = encodeURIComponent(getUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }

  function copyLink() {
    navigator.clipboard.writeText(getUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="animate-fade-slide-up border border-cream-200 rounded-xl px-4 py-3.5 flex items-center justify-between gap-3">
      <span className="text-xs font-medium text-ink-700">Share this product</span>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={shareWhatsApp}
          title="Share on WhatsApp"
          className="relative w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer pulse-ring"
        >
          <MessageCircle className="w-4.5 h-4.5 text-white relative z-10" fill="white" strokeWidth={0} />
        </button>

        <button
          type="button"
          onClick={shareFacebook}
          title="Share on Facebook"
          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
          </svg>
        </button>

        <button
          type="button"
          onClick={copyLink}
          title="Copy link"
          className="w-10 h-10 rounded-full border border-cream-200 flex items-center justify-center hover:scale-110 active:scale-95 hover:bg-cream-50 transition-transform duration-200 cursor-pointer"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Link2 className="w-4 h-4 text-ink-900" />
          )}
        </button>
      </div>
    </div>
  );
}