import { StarMark } from "./StarMark";

export function SectionMarker({
  index,
  label,
  tone = "dark",
}: {
  index: string;
  label: string;
  tone?: "dark" | "light" | "ingco";
}) {
  const colorClass =
    tone === "light"
      ? "text-brand-orange-dim"
      : tone === "ingco"
        ? "text-brand-ingco-yellow"
        : "text-brand-orange";
  return (
    <div className={`flex items-center gap-2 ${colorClass}`}>
      <StarMark className="h-3 w-3" />
      <span className="font-mono-meta text-[11px] font-semibold uppercase tracking-[0.2em]">
        {index} / {label}
      </span>
    </div>
  );
}
