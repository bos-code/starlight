import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { businessSettings } from "@/config/business";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ProductVisual } from "@/components/ProductVisual";
import { SectionMarker } from "@/components/brand/SectionMarker";

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
      <section className="technical-grid border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto grid max-w-7xl border-x border-brand-border lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center border-b border-brand-border px-6 py-16 sm:px-10 lg:border-b-0 lg:border-r lg:px-12">
            <SectionMarker index="STL / 05" label="Company Profile" />
            <h1 className="mt-5 font-heading text-5xl font-extrabold uppercase leading-[0.92] text-brand-white sm:text-6xl">
              Built in the market.
              <br />
              <span className="text-brand-orange">Ready for scale.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-steel">
              {businessSettings.legalName} supplies power tools, hand tools, welding
              equipment, safety products and industrial supplies to technicians,
              contractors and dealers across Nigeria. This digital showroom turns that
              market experience into a faster product-to-quote workflow.
            </p>
          </div>
          <ProductVisual
            categorySlug="small-construction-equipment"
            categoryName="Starlite industrial supply"
            className="min-h-[420px]"
            sizes="(min-width: 1024px) 55vw, 100vw"
            imageClassName="p-[11%]"
            priority
          />
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
              className="border border-brand-border bg-brand-surface p-6 text-center"
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
                className="border border-brand-border bg-brand-surface p-6"
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
              className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-white"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
