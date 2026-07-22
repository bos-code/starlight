import { StarMark } from "./brand/StarMark";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center rounded-lg bg-brand-orange ${className}`}>
      <StarMark className="h-[60%] w-[60%] text-brand-graphite" />
    </span>
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
