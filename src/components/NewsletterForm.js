"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function NewsletterForm({ variant = "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const isDark = variant === "dark";

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-900 bg-green-50 border border-green-200 rounded-full px-5 py-3">
        <Check className="w-4 h-4 text-green-600 shrink-0" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex items-center gap-2 bg-white border border-cream-200 rounded-full p-1.5 shadow-sm focus-within:border-ink-900 transition-colors">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 bg-transparent text-sm px-4 py-2 text-ink-900 placeholder:text-ink-400 focus:outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 bg-ink-900 text-white text-sm font-medium px-5 py-2.5 rounded-full cursor-pointer hover:bg-black transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600 mt-2.5">{message}</p>
      )}
    </form>
  );
}