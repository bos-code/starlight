import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Headphones,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { brands, products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { ProductVisual } from "@/components/ProductVisual";

const featuredProduct =
  products.find((product) => product.id === "ingco-CDLI20012") ??
  products.find((product) => product.id === "ingco-CIWLI2001") ??
  products[0];

const angleGrinder =
  products.find((product) => product.productType?.toLowerCase().includes("angle grinder")) ??
  products[0];

const rotaryHammer =
  products.find((product) => {
    const type = product.productType?.toLowerCase() ?? "";
    return type.includes("rotary hammer") || type.includes("hammer drill");
  }) ?? products[0];

const handTool =
  products.find((product) => product.categoryId === "cat-hand-tools") ?? products[0];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Original tools",
    subtitle: "Catalogue-led sourcing",
  },
  {
    icon: Truck,
    title: "Nationwide enquiries",
    subtitle: "Delivery confirmed by sales",
  },
  {
    icon: Headphones,
    title: "Expert support",
    subtitle: "Guidance before purchase",
  },
  {
    icon: ClipboardList,
    title: "Structured quotation",
    subtitle: "Several tools, one request",
  },
];

const productCards = [
  {
    title: "Angle Grinders",
    description: "Cutting and grinding tools for fabrication and site work.",
    product: angleGrinder,
    href: "/products?category=power-tools",
  },
  {
    title: "Rotary Hammers",
    description: "Heavy-duty drilling options for concrete and masonry.",
    product: rotaryHammer,
    href: "/products?category=power-tools",
  },
  {
    title: "Hand Tools",
    description: "Workshop essentials for accurate everyday work.",
    product: handTool,
    href: "/products?category=hand-tools",
  },
];

const platformStats = [
  { icon: Package, value: `${products.length}`, label: "Catalogue products" },
  { icon: Users, value: `${brands.length}`, label: "Brand families" },
  { icon: MapPin, value: "01", label: `${businessSettings.city} hub` },
  { icon: Truck, value: "NG", label: "Enquiry coverage" },
];

export function DualBrandHero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-[#070909]">
      <div className="technical-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid gap-3 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative isolate flex min-h-[610px] overflow-hidden border border-brand-border bg-[#0a0d0c] px-6 py-10 sm:px-10 lg:px-12 xl:min-h-[680px] xl:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(244,196,0,0.14),transparent_30%),linear-gradient(130deg,rgba(10,13,12,0.82),rgba(5,7,6,0.98))]" />
            <div className="pointer-events-none absolute -bottom-32 -left-28 h-96 w-96 rounded-full border border-brand-orange/15" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full border border-brand-orange/10" />
            <div className="pointer-events-none absolute right-8 top-6 font-heading text-[11rem] font-extrabold leading-none text-white/[0.018] sm:text-[14rem]">
              STL
            </div>

            <div className="relative z-10 my-auto max-w-2xl">
              <p className="font-mono-meta text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green sm:text-xs">
                Industrial tools. Smarter procurement.
              </p>

              <h1 className="mt-5 font-heading text-5xl font-extrabold uppercase leading-[0.91] tracking-[-0.025em] text-brand-white sm:text-6xl xl:text-[4.8rem]">
                Powering industries with
                <br />
                premium tools.
                <br />
                <span className="text-brand-orange">Procurement made smart.</span>
              </h1>

              <div className="mt-6 h-1 w-16 bg-brand-orange" />

              <p className="mt-6 max-w-xl text-sm leading-7 text-brand-steel sm:text-base">
                Starlite Tools helps contractors, technicians, dealers, and bulk buyers
                discover professional tools, build a structured request, and continue the
                purchase directly with the sales team.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange px-6 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.05em] text-brand-graphite transition hover:brightness-110"
                >
                  <ClipboardList className="h-4 w-4" />
                  Request a Quotation
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 border border-brand-green/70 bg-brand-surface/75 px-6 py-4 font-heading text-sm font-extrabold uppercase tracking-[0.05em] text-brand-white transition hover:border-brand-orange hover:text-brand-orange"
                >
                  Explore Catalogue
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid border border-brand-border bg-brand-border sm:grid-cols-2 xl:grid-cols-4">
                {trustPoints.map(({ icon: Icon, title, subtitle }) => (
                  <div
                    key={title}
                    className="min-h-28 border-b border-r border-brand-border bg-[#0b0f0d] p-4 last:border-b-0 sm:[&:nth-child(2n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0"
                  >
                    <Icon className="h-6 w-6 text-brand-green" strokeWidth={1.5} />
                    <p className="mt-3 font-heading text-[13px] font-bold uppercase text-brand-white">
                      {title}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-brand-steel-dim">
                      {subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="relative min-h-[360px] overflow-hidden border border-brand-border bg-[#0b0e0d] sm:min-h-[410px]">
              <ProductVisual
                product={featuredProduct}
                categorySlug="cordless-tools"
                categoryName="INGCO professional power tools"
                className="absolute inset-0"
                sizes="(min-width: 1024px) 52vw, 100vw"
                imageClassName="translate-x-[22%] translate-y-[3%] scale-[1.02] p-[7%] sm:translate-x-[25%] sm:p-[6%] lg:translate-x-[26%] lg:scale-[1.06]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(5,7,6,0.97)_0%,rgba(5,7,6,0.9)_30%,rgba(5,7,6,0.2)_68%,rgba(5,7,6,0.45)_100%)]" />

              <div className="absolute inset-y-0 left-0 z-30 flex w-[68%] flex-col justify-center p-7 sm:w-[57%] sm:p-9 lg:w-[52%]">
                <span className="w-fit bg-brand-orange px-3 py-1.5 font-heading text-lg font-extrabold uppercase tracking-[0.08em] text-brand-graphite">
                  INGCO
                </span>
                <h2 className="mt-5 font-heading text-4xl font-bold leading-[0.94] text-brand-white sm:text-5xl">
                  Professional
                  <br />
                  Power Tools
                </h2>
                <div className="mt-5 h-1 w-10 bg-brand-orange" />
                <p className="mt-5 max-w-xs text-sm leading-6 text-brand-steel">
                  Built for demanding work and supplied through Starlite’s catalogue-to-quote
                  process.
                </p>
                <Link
                  href="/products?brand=ingco"
                  className="mt-6 inline-flex w-fit items-center gap-2 bg-brand-orange px-5 py-3 font-heading text-sm font-extrabold uppercase text-brand-graphite transition hover:brightness-110"
                >
                  View Range
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {productCards.map(({ title, description, product, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="group overflow-hidden border border-brand-border bg-brand-surface transition hover:border-brand-orange"
                >
                  <div className="relative h-44 border-b border-brand-border sm:h-40 xl:h-48">
                    <ProductVisual
                      product={product}
                      categoryName={title}
                      className="absolute inset-0"
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 33vw, 100vw"
                      imageClassName="p-[8%] group-hover/visual:scale-[1.05]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-xl font-bold text-brand-white">{title}</h3>
                    <p className="mt-1.5 min-h-10 text-xs leading-5 text-brand-steel-dim">
                      {description}
                    </p>
                    <span className="mt-4 flex items-center justify-between border-t border-brand-border pt-3 font-heading text-xs font-bold uppercase tracking-[0.06em] text-brand-green transition group-hover:text-brand-orange">
                      View products
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 border border-brand-border bg-brand-border sm:grid-cols-4">
              {platformStats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex min-h-24 items-center gap-3 border-b border-r border-brand-border bg-[#0b0f0d] p-4 sm:border-b-0 sm:last:border-r-0"
                >
                  <Icon className="h-7 w-7 shrink-0 text-brand-orange" strokeWidth={1.5} />
                  <div>
                    <p className="font-heading text-2xl font-extrabold text-brand-white">{value}</p>
                    <p className="font-mono-meta text-[8px] uppercase tracking-[0.1em] text-brand-steel-dim">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center justify-center gap-3 border border-brand-border bg-[#0a0d0c] px-6 py-5 text-center sm:flex-row sm:gap-6">
          <span className="font-mono-meta text-[9px] uppercase tracking-[0.2em] text-brand-steel-dim">
            Supplier of
          </span>
          <span className="h-px w-12 bg-brand-border sm:h-7 sm:w-px" />
          <span className="font-heading text-3xl font-extrabold uppercase tracking-[0.06em] text-brand-orange">
            INGCO Tools
          </span>
          <span className="text-xs text-brand-steel-dim">
            Contact sales to confirm model availability, pricing, and delivery.
          </span>
        </div>
      </div>

      <p className="sr-only">
        {businessSettings.legalName} digital showroom featuring professional industrial tools.
      </p>
    </section>
  );
}
