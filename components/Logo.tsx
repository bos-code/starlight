import { StarMark } from "./brand/StarMark";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span className="absolute inset-[14%] rotate-45 border border-brand-orange/40" />
      <StarMark className="relative h-[72%] w-[72%] text-brand-orange drop-shadow-[0_0_12px_rgba(244,196,0,0.35)]" />
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-heading leading-none">
        <span className="block text-xl font-extrabold tracking-[0.06em] text-brand-orange">
          STARLITE TOOLS
        </span>
        <span className="mt-0.5 block font-mono-meta text-[7px] font-semibold tracking-[0.2em] text-brand-white/80">
          INDUSTRIAL TOOLS &amp; SOLUTIONS
        </span>
      </span>
    </span>
  );
}
