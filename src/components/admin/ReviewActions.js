"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";

export default function ReviewActions({ reviewId, isApproved }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleApproval() {
    setLoading(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !isApproved }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggleApproval}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-medium text-ink-700 hover:text-ink-900 cursor-pointer disabled:opacity-50"
      >
        {isApproved ? (
          <>
            <EyeOff className="w-3.5 h-3.5" /> Hide
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" /> Show
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  );
}