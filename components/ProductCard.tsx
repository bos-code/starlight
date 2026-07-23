"use client";

import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { getBrand, getCategory } from "@/lib/data";
import type { Product } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useQuote } from "@/lib/quote-context";
import { buildProductEnquiryUrl } from "@/lib/whatsapp";

interface ProductCardProps {
  product: Product;
  compareChecked?: boolean;
  onToggleCompare?: (productId: string) => void;
}

export function ProductCard({ product, compareChecked = false, onToggleCompare }: ProductCardProps) {
  const { addItem } = useQuote();
  const brand = getBrand(product.brandId);
  const category = getCategory(product.categoryId);
  const displaySpecs = product.specs.filter((s) => s.label !== "Feature").slice(0, 3);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface transition hover:border-brand-orange/50">
      <Link href={`/products/${product.slug}`} className="relative block">
        <ProductImagePlaceholder
          categorySlug={category?.slug ?? ""}
          className="aspect-square w-full"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <StatusBadge status={product.availabilityStatus} />
          {product.isFeatured && (
            <span className="inline-flex items-center rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-graphite">
              Featured
            </span>
          )}
        </div>
        <a
          href={buildProductEnquiryUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Ask about ${product.name} on WhatsApp`}
          title="Ask on WhatsApp"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-graphite/70 text-brand-steel opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-emerald-400"
        >
          <WhatsAppIcon className="h-4 w-4" />
        </a>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
            {brand?.name ?? "Starlite"}
          </span>
          <span className="font-mono-meta text-[10px] text-brand-steel-dim">{product.sku}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading text-base font-semibold text-brand-white transition group-hover:text-brand-orange">
            {product.name}
          </h3>
        </Link>

        {displaySpecs.length > 0 && (
          <ul className="space-y-0.5 text-xs text-brand-steel">
            {displaySpecs.map((spec) => (
              <li key={spec.label} className="flex items-center gap-1.5">
                <span className="h-1 w-1 shrink-0 rounded-full bg-brand-border" />
                <span className="text-brand-steel-dim">{spec.label}:</span> {spec.value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-brand-steel-dim">Price</p>
            <p className="font-heading text-sm font-semibold text-brand-white">Request Quote</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            className="rounded-lg border border-brand-orange px-3 py-2 text-xs font-bold uppercase tracking-wide text-brand-orange transition hover:bg-brand-orange hover:text-brand-graphite"
          >
            Add to Quote
          </button>
        </div>

        {onToggleCompare && (
          <label className="flex items-center gap-2 border-t border-brand-border pt-3 text-xs text-brand-steel">
            <input
              type="checkbox"
              checked={compareChecked}
              onChange={() => onToggleCompare(product.id)}
              className="h-3.5 w-3.5 rounded border-brand-border bg-brand-graphite accent-brand-orange"
            />
            <GitCompareArrows className="h-3.5 w-3.5" />
            Compare
          </label>
        )}
      </div>
    </div>
  );
}
