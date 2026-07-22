"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useQuote } from "@/lib/quote-context";
import type { Product } from "@/lib/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useQuote();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-brand-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-brand-steel hover:text-brand-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            className="h-11 w-14 border-x border-brand-border bg-transparent text-center text-sm text-brand-white focus:outline-none"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center text-brand-steel hover:text-brand-white"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            addItem(product.id, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="flex-1 rounded-lg bg-brand-orange px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
        >
          {added ? "Added to Quote" : "Request Quote"}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addItem(product.id, quantity);
          router.push("/quote");
        }}
        className="mt-3 w-full rounded-lg border border-brand-border py-3 text-sm font-semibold text-brand-white transition hover:border-brand-white"
      >
        Add &amp; Go to Quote List
      </button>
    </div>
  );
}
