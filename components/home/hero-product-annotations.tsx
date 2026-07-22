import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";

/**
 * Renders only specs that exist on the product record — which is itself generated
 * from the confirmed INGCO catalogue dataset (lib/ingco-catalogue.ts). Nothing here
 * is invented; if a spec isn't in the data, it isn't shown.
 */
export function HeroProductAnnotations({ product }: { product: Product }) {
  const specsToShow = product.specs
    .filter((s) => s.label !== "Feature")
    .slice(0, 4);

  return (
    <div className="rounded-xl border border-brand-ingco-yellow/25 bg-brand-graphite/70 p-4 backdrop-blur-sm">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {specsToShow.map((spec) => (
          <div key={spec.label}>
            <dt className="font-mono-meta text-[10px] uppercase tracking-wider text-brand-steel-dim">
              {spec.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-brand-white">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3">
        <span className="font-mono-meta text-[10px] uppercase tracking-wider text-brand-steel-dim">
          SKU {product.sku} &middot; Confirm availability
        </span>
        {product.detailUrl && (
          <a
            href={product.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-ingco-yellow hover:underline"
          >
            Manufacturer page
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
