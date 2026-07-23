"use client";

import { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import type { Product } from "@/lib/types";

const tabs = ["Description", "Specifications", "Included", "Technical Resources"] as const;
type Tab = (typeof tabs)[number];

const POWER_PATTERN = /volt|power|torque|speed|current|watt|amp|impact|energy|rpm|bpm/i;
const PHYSICAL_PATTERN = /weight|length|width|height|diameter|size|dimension|capacity|tank|chuck|blade|disc/i;

function groupSpecs(specs: Product["specs"]) {
  const confirmed = specs.filter((s) => s.label !== "Feature");
  const power = confirmed.filter((s) => POWER_PATTERN.test(s.label));
  const physical = confirmed.filter((s) => !POWER_PATTERN.test(s.label) && PHYSICAL_PATTERN.test(s.label));
  const other = confirmed.filter((s) => !power.includes(s) && !physical.includes(s));
  return [
    { title: "Power & Performance", specs: power },
    { title: "Physical Specifications", specs: physical },
    { title: "Other Confirmed Specs", specs: other },
  ].filter((group) => group.specs.length > 0);
}

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");
  const specGroups = groupSpecs(product.specs);

  return (
    <div className="mt-12">
      <div className="flex gap-6 overflow-x-auto border-b border-brand-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-semibold uppercase tracking-wide transition ${
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
          <div className="max-w-2xl space-y-6">
            {specGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {group.title}
                </h3>
                <div className="divide-y divide-brand-border rounded-lg border border-brand-border">
                  {group.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between px-4 py-3 text-sm">
                      <span className="text-brand-steel-dim">{spec.label}</span>
                      <span className="font-medium text-brand-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {active === "Included" && (
          <>
            {product.included.length > 0 ? (
              <ul className="max-w-md space-y-2 text-sm text-brand-steel">
                {product.included.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-brand-steel">
                Box contents not yet confirmed for this SKU — contact Starlite sales to confirm
                what&apos;s included before ordering.
              </p>
            )}
          </>
        )}

        {active === "Technical Resources" && (
          <div className="flex flex-col gap-3 text-sm">
            {product.detailUrl && (
              <a
                href={product.detailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-brand-orange hover:underline"
              >
                <ArrowUpRight className="h-4 w-4" />
                View manufacturer product page
              </a>
            )}
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
