import type { AvailabilityStatus } from "@/lib/types";

const statusConfig: Record<AvailabilityStatus, { label: string; className: string }> = {
  in_stock: { label: "In Stock", className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30" },
  low_stock: { label: "Low Stock", className: "bg-brand-orange/15 text-brand-orange ring-brand-orange/30" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-500/15 text-red-400 ring-red-500/30" },
  price_on_request: { label: "Price on Request", className: "bg-brand-steel/15 text-brand-steel ring-brand-steel/30" },
};

export function StatusBadge({ status }: { status: AvailabilityStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}
