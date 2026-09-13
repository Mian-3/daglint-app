"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Star, PenLine } from "lucide-react";

export default function ReviewForm({ productId }) {
  const router = useRouter();
  const { status } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [guestName, setGuestName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = status === "authenticated";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }
    if (!isLoggedIn && !guestName.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, comment, guestName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setRating(0);
      setTitle("");
      setComment("");
      setGuestName("");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="border border-green-200 bg-green-50 text-green-800 rounded-lg p-5 text-sm animate-fade-slide-up">
        Thank you! Your review has been posted.
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2.5 bg-ink-900 text-white pl-5 pr-6 py-3 rounded-full text-sm font-medium hover:bg-black hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <PenLine className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
        Write a Review
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-cream-200 rounded-lg p-5 max-w-xl animate-fade-slide-up"
    >
      <h3 className="font-semibold text-sm mb-4">Write a Review</h3>

      {!isLoggedIn && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-cream-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Title <span className="text-ink-600 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-cream-200 rounded-md px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-black disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-sm text-ink-600 hover:text-ink-900 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}