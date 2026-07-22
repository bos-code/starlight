export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect width="40" height="40" rx="8" className="fill-brand-orange" />
      <path
        d="M20 6l3.09 8.26L31 17l-7.91 2.74L20 28l-3.09-8.26L9 17l7.91-2.74L20 6z"
        className="fill-brand-graphite"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-heading leading-none">
        <span className="block text-lg font-bold tracking-wide text-brand-white">
          STARLITE
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.3em] text-brand-orange">
          TOOLS CO. LTD
        </span>
      </span>
    </span>
  );
}
