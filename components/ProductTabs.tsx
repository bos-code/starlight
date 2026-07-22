"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { Product } from "@/lib/types";

const tabs = ["Description", "Specifications", "Included", "Documents"] as const;
type Tab = (typeof tabs)[number];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div className="mt-12">
      <div className="flex gap-6 border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold uppercase tracking-wide transition ${
              active === tab
                ? "border-brand-orange text-brand-white"
                : "border-transparent text-brand-steel-dim hover:text-brand-steel"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "Description" && (
          <p className="max-w-3xl text-sm leading-relaxed text-brand-steel">
            {product.description}
          </p>
        )}

        {active === "Specifications" && (
          <div className="max-w-2xl divide-y divide-brand-border rounded-lg border border-brand-border">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between px-4 py-3 text-sm">
                <span className="text-brand-steel-dim">{spec.label}</span>
                <span className="font-medium text-brand-white">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {active === "Included" && (
          <ul className="max-w-md space-y-2 text-sm text-brand-steel">
            {product.included.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {active === "Documents" && (
          <div className="flex flex-col gap-2 text-sm">
            <span className="flex items-center gap-2 text-brand-steel-dim">
              <FileText className="h-4 w-4" />
              Datasheet and manual available on request via WhatsApp.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
