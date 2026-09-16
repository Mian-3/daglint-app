import NewsletterForm from "@/components/NewsletterForm";

export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-cream-50 flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display italic font-semibold text-3xl md:text-4xl text-ink-900 mb-10">
        Daglint
      </p>

      <p className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-ink-600 mb-5">
        Launching Soon
      </p>

      <h1 className="text-4xl md:text-6xl font-display italic font-medium text-ink-900 mb-6">
        Coming Soon
      </h1>

      <span className="w-12 h-px bg-ink-900/20 mb-6" />

      <p className="text-sm md:text-base text-ink-600 max-w-md mb-12 leading-relaxed">
        We&apos;re curating something extraordinary. Leave your email below and
        we&apos;ll let you know the moment we launch.
      </p>

      <NewsletterForm variant="light" />
    </div>
  );
}