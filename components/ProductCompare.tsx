"use client";

import { X } from "lucide-react";
import { getBrand, getCategory } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { StatusBadge } from "./StatusBadge";

export function ProductCompareTray({
  products,
  onRemove,
  onClear,
  onOpen,
}: {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  if (products.length === 0) return null;

  return (
    <div className="sticky bottom-0 z-30 border-t border-brand-border bg-brand-graphite/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <span className="font-mono-meta text-xs uppercase tracking-wider text-brand-steel-dim">
          Compare ({products.length}/4)
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {products.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-surface py-1 pl-3 pr-1.5 text-xs text-brand-white"
            >
              {p.name}
              <button
                type="button"
                onClick={() => onRemove(p.id)}
                aria-label={`Remove ${p.name} from comparison`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-brand-steel-dim hover:bg-brand-graphite hover:text-brand-white"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-brand-steel-dim hover:text-brand-white"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onOpen}
            disabled={products.length < 2}
            className="rounded-lg bg-brand-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCompareModal({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  const allLabels = Array.from(
    new Set(products.flatMap((p) => p.specs.filter((s) => s.label !== "Feature").map((s) => s.label)))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-t-2xl border border-brand-border bg-brand-graphite-light sm:rounded-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-brand-border bg-brand-graphite-light px-6 py-4">
          <h2 className="font-heading text-lg font-bold uppercase text-brand-white">
            Compare Products
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-brand-steel hover:text-brand-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-40 pb-4 pr-4 align-bottom text-xs uppercase tracking-wide text-brand-steel-dim">
                  &nbsp;
                </th>
                {products.map((p) => {
                  const category = getCategory(p.categoryId);
                  return (
                    <th key={p.id} className="min-w-[180px] pb-4 pr-4 align-bottom">
                      <ProductImagePlaceholder
                        categorySlug={category?.slug ?? ""}
                        className="aspect-square w-full rounded-lg"
                        iconClassName="h-8 w-8"
                      />
                      <p className="mt-2 font-heading text-sm font-semibold text-brand-white">
                        {p.name}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-brand-border">
                <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-brand-steel-dim">
                  Brand
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pr-4 text-brand-white">
                    {getBrand(p.brandId)?.name}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-brand-border">
                <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-brand-steel-dim">
                  Model / SKU
                </td>
                {products.map((p) => (
                  <td key={p.id} className="font-mono-meta py-3 pr-4 text-brand-white">
                    {p.sku}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-brand-border">
                <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-brand-steel-dim">
                  Availability
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pr-4">
                    <StatusBadge status={p.availabilityStatus} />
                  </td>
                ))}
              </tr>
              <tr className="border-t border-brand-border">
                <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-brand-steel-dim">
                  Power Source
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 pr-4 text-brand-white">
                    {p.powerSource ?? "Confirm with sales"}
                  </td>
                ))}
              </tr>
              {allLabels.map((label) => (
                <tr key={label} className="border-t border-brand-border">
                  <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-brand-steel-dim">
                    {label}
                  </td>
                  {products.map((p) => (
                    <td key={p.id} className="py-3 pr-4 text-brand-white">
                      {p.specs.find((s) => s.label === label)?.value ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
