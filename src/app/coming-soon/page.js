import NewsletterForm from "@/components/NewsletterForm";

export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Desktop / Tablet: full banner image as background */}
      <div className="hidden md:block absolute inset-0">
        <img
          src="/coming-soon.png"
          alt="Daglint - Coming Soon"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-16 flex justify-center">
          <NewsletterForm variant="dark" />
        </div>
      </div>

      {/* Mobile: custom-built version */}
      <div className="md:hidden absolute inset-0 bg-[#f2ede4] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display italic font-semibold text-4xl text-ink-900 mb-8">
          DaGlint
        </p>

        <p className="text-xs uppercase tracking-[0.4em] text-ink-900 mb-4">
          Coming Soon
        </p>

        <span className="w-10 h-px bg-ink-900/40 mb-4" />

        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-600 leading-relaxed mb-10">
          Something Extraordinary
          <br />
          Is On Its Way
        </p>

        <NewsletterForm variant="light" />
      </div>
    </div>
  );
}