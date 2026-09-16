"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

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
      <div
        className={`flex items-center gap-2 text-xs md:text-sm ${
          isDark ? "text-white" : "text-ink-900"
        }`}
      >
        <Check className="w-4 h-4 text-green-500" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <div
        className={`flex items-center gap-2 border rounded-full px-4 py-2.5 ${
          isDark
            ? "border-white/30 bg-white/10 backdrop-blur-sm"
            : "border-ink-900/20 bg-white"
        }`}
      >
        <Mail className={`w-4 h-4 shrink-0 ${isDark ? "text-white/70" : "text-ink-600"}`} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className={`flex-1 bg-transparent text-xs md:text-sm focus:outline-none ${
            isDark ? "text-white placeholder:text-white/50" : "text-ink-900 placeholder:text-ink-400"
          }`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`text-xs font-medium whitespace-nowrap px-3 py-1 rounded-full cursor-pointer transition-colors disabled:opacity-50 ${
            isDark
              ? "bg-white text-ink-900 hover:bg-cream-100"
              : "bg-ink-900 text-white hover:bg-black"
          }`}
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p className={`text-[11px] mt-2 ${isDark ? "text-white/80" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}