import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/QuoteBuilder";

export const metadata: Metadata = {
  title: "Quote List | Starlite Tools",
  description:
    "Review your selected products, add your buyer details, and submit a structured quote request to the Starlite Tools sales team on WhatsApp.",
};

export default function QuotePage() {
  return <QuoteBuilder />;
}
