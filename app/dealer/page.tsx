import type { Metadata } from "next";
import { DealerDashboard } from "@/components/DealerDashboard";

export const metadata: Metadata = {
  title: "Dealer Portal | Starlite Tools",
  description:
    "Track your quote requests with Starlite Tools, start a new quote, or reach the sales team directly on WhatsApp.",
};

export default function DealerPage() {
  return <DealerDashboard />;
}
