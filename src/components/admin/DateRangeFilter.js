"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Calendar } from "lucide-react";

const OPTIONS = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
  { value: "custom", label: "Custom" },
];

export default function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "month";
  const [fromDate, setFromDate] = useState(searchParams.get("from") || "");
  const [toDate, setToDate] = useState(searchParams.get("to") || "");

  function setRange(range) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    if (range !== "custom") {
      params.delete("from");
      params.delete("to");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyCustomRange() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", "custom");
    params.set("from", fromDate);
    params.set("to", toDate);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setRange(opt.value)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
            currentRange === opt.value
              ? "bg-ink-900 text-white border-ink-900"
              : "border-cream-200 text-ink-700 hover:border-ink-900"
          }`}
        >
          {opt.label}
        </button>
      ))}

      {currentRange === "custom" && (
        <div className="flex items-center gap-2 ml-1">
          <Calendar className="w-4 h-4 text-ink-600" />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="text-xs border border-cream-200 rounded-md px-2 py-1.5"
          />
          <span className="text-xs text-ink-600">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="text-xs border border-cream-200 rounded-md px-2 py-1.5"
          />
          <button
            type="button"
            onClick={applyCustomRange}
            className="text-xs bg-ink-900 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-black"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}