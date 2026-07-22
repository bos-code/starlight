import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { businessSettings } from "@/config/business";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "About | Starlite Tools",
  description:
    "Starlite Tools Company Limited — power tools, hand tools, welding equipment, safety products and industrial supplies for dealers, technicians and contractors across Nigeria.",
};

const values = [
  {
    title: "Original Tools Only",
    body: "Every product listed is sourced through verified channels. No counterfeits, no grey-market substitutes.",
  },
  {
    title: "Dealer-First Pricing",
    body: "Wholesale and bulk buyers get dedicated pricing support — request a quote and our sales team will follow up directly.",
  },
  {
    title: "Built for the Trade",
    body: "From construction to welding, carpentry and electrical work, our catalogue is organized around how tradespeople actually shop.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="grid-texture border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            About Starlite Tools
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-tight text-brand-white sm:text-5xl">
            Built in the market.
            <br />
            Ready for the next scale.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-steel">
            {businessSettings.legalName} has supplied power tools, hand tools, welding
            equipment, safety products and industrial supplies to technicians, contractors
            and dealers across Nigeria for {businessSettings.yearsInBusiness} years. This
            digital showroom brings that offline strength online — so customers, dealers
            and bulk buyers can find products and request quotes faster.
          </p>
        </div>
      </section>

      <section className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-12 sm:grid-cols-4">
          {[
            [businessSettings.yearsInBusiness, "Years in Business"],
            [businessSettings.productsSupplied, "Products Supplied"],
            [businessSettings.dealerPartners, "Dealer Partners"],
            [businessSettings.coverage, "Market Reach"],
          ].map(([stat, label]) => (
            <div
              key={label}
              className="rounded-xl border border-brand-border bg-brand-surface p-6 text-center"
            >
              <p className="font-heading text-3xl font-extrabold text-brand-orange">{stat}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-brand-steel-dim">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
              What We Stand For
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold uppercase text-brand-white sm:text-3xl">
              How Starlite Does Business
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-brand-border bg-brand-surface p-6"
              >
                <ShieldCheck className="h-8 w-8 text-brand-orange" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-lg font-bold text-brand-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-steel">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="bg-brand-navy">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
            Support
          </p>
          <h2 className="font-heading text-2xl font-bold uppercase text-brand-white sm:text-3xl">
            Need help with a product or an order?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-brand-steel">
            Reach our sales team directly for warranty questions, bulk pricing, delivery
            timelines, or help identifying the right tool for your job.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-brand-steel">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-orange" />
              {businessSettings.whatsappDisplay}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-orange" />
              {businessSettings.address}, {businessSettings.state}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-white"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
