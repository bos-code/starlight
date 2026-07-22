import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsCatalog } from "@/components/ProductsCatalog";

export const metadata: Metadata = {
  title: "Product Catalogue | Starlite Tools",
  description:
    "Browse power tools, cordless tools, hand tools, welding equipment, safety gear and generators from Starlite Tools. Filter by category, brand and availability, then request a quote.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}
