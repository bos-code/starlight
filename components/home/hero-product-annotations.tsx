import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";

/**
 * Renders only specs that exist on the product record — which is itself generated
 * from the confirmed INGCO catalogue dataset (lib/ingco-catalogue.ts). Nothing here
 * is invented; if a spec isn't in the data, it isn't shown. Kept deliberately
 * compact (chip row, not a card) so the hero stays visually light.
 */
export function HeroProductAnnotations({ product }: { product: Product }) {
  const specsToShow = product.specs.filter((s) => s.label !== "Feature").slice(0, 3);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {specsToShow.map((spec) => (
          <span
            key={spec.label}
            className="rounded-full border border-brand-ingco-yellow/25 bg-brand-graphite/60 px-3 py-1 font-mono-meta text-[11px] text-brand-white"
          >
            <span className="text-brand-steel-dim">{spec.label}:</span> {spec.value}
          </span>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-meta text-[10px] uppercase tracking-wider text-brand-steel-dim">
        <span>SKU {product.sku} &middot; Confirm availability</span>
        {product.detailUrl && (
          <a
            href={product.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-sans normal-case tracking-normal text-brand-ingco-yellow hover:underline"
          >
            Manufacturer page
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
