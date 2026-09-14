"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StockUpdater({ productId, currentStock }) {
  const router = useRouter();
  const [value, setValue] = useState(currentStock);
  const [saving, setSaving] = useState(false);

  const changed = parseInt(value) !== currentStock;

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: parseInt(value) || 0 }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-20 border border-cream-200 rounded-md px-2 py-1.5 text-sm"
      />
      {changed && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="text-xs bg-ink-900 text-white px-3 py-1.5 rounded-md cursor-pointer hover:bg-black disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}