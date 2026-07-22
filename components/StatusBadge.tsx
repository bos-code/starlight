import type { AvailabilityStatus } from "@/lib/types";

const statusConfig: Record<AvailabilityStatus, { label: string; className: string }> = {
  in_stock: { label: "In Stock", className: "bg-brand-green/15 text-brand-green ring-brand-green/30" },
  low_stock: { label: "Low Stock", className: "bg-brand-amber/15 text-brand-amber ring-brand-amber/30" },
  out_of_stock: { label: "Out of Stock", className: "bg-brand-red/15 text-brand-red ring-brand-red/30" },
  price_on_request: { label: "Confirm Availability", className: "bg-brand-steel/15 text-brand-steel ring-brand-steel/30" },
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
