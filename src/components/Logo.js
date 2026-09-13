import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-baseline ${className}`}>
      <span className="font-display italic font-semibold text-2xl leading-none tracking-tight text-ink-900">
        DaGlint
      </span>
    </Link>
  );
}