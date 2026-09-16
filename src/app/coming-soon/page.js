export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <img
        src="/hero.jpg"
        alt="Daglint"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 animate-fade-slide-up">
        <p className="font-display italic font-semibold text-3xl md:text-4xl text-white mb-8">
          Daglint
        </p>

        <p className="text-white/70 text-xs uppercase tracking-[0.35em] mb-5">
          Launching Soon
        </p>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display italic font-medium text-white max-w-2xl leading-tight mb-6">
          Something premium is on its way.
        </h1>

        <p className="text-white/80 text-sm md:text-base max-w-md mb-10">
          We&apos;re curating a collection worth the wait. Check back soon.
        </p>

        <div className="w-14 h-px bg-white/40" />
      </div>
    </div>
  );
}