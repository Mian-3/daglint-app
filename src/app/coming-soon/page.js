export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-cream-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="font-display italic font-semibold text-3xl text-ink-900 mb-6">
        Daglint
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-ink-600 mb-4">
        Something New Is Coming
      </p>
      <h1 className="text-3xl md:text-5xl font-display font-medium text-ink-900 max-w-xl mb-5">
        We&apos;re putting the finishing touches on our store.
      </h1>
      <p className="text-sm text-ink-600 max-w-md">
        Check back soon for premium products, curated just for you.
      </p>
    </div>
  );
}