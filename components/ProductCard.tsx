"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { brands, getBrand, getCategory } from "@/lib/data";
import type { Product } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { useQuote } from "@/lib/quote-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useQuote();
  const brand = getBrand(product.brandId);
  const category = getCategory(product.categoryId);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface transition hover:border-brand-orange/50">
      <Link href={`/products/${product.slug}`} className="relative block">
        <ProductImagePlaceholder
          categorySlug={category?.slug ?? ""}
          className="aspect-[4/3] w-full"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <StatusBadge status={product.availabilityStatus} />
          {product.isFeatured && (
            <span className="inline-flex items-center rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-graphite">
              Featured
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Save product"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-graphite/70 text-brand-steel opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-brand-orange"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-orange">
          {brand?.name ?? "Starlite"}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading text-base font-semibold text-brand-white transition group-hover:text-brand-orange">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs text-brand-steel">
          {product.specs[0] && <span>{product.specs[0].value}</span>}
          {product.voltage && (
            <>
              <span className="h-1 w-1 rounded-full bg-brand-border" />
              <span>{product.voltage}</span>
            </>
          )}
        </div>

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
      </div>
    </div>
  );
}

export const allBrandsForFilter = brands;
