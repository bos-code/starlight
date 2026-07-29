import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  ClipboardList,
  Flame,
  Hammer,
  MapPin,
  MessagesSquare,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { industries, products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { ProductVisual } from "@/components/ProductVisual";
import { DualBrandHero } from "@/components/home/dual-brand-hero";
import { ContactMap } from "@/components/ContactMap";
import { SectionMarker } from "@/components/brand/SectionMarker";

const industryIcons: Record<string, typeof Building2> = {
  construction: Building2,
  "welding-fabrication": Flame,
  "carpentry-woodworking": Hammer,
  "electrical-installation": Zap,
};

const industryCategorySlugs: Record<string, string> = {
  construction: "small-construction-equipment",
  "welding-fabrication": "welding-machines",
  "carpentry-woodworking": "hand-tools",
  "electrical-installation": "measuring-tools",
};

const trustPoints = [
  { icon: ShieldCheck, title: "Original Tools", subtitle: "100% Genuine" },
  { icon: BatteryCharging, title: "Warranty Support", subtitle: "Peace of Mind" },
  { icon: Truck, title: "Bulk & Projects", subtitle: "Special Pricing" },
  { icon: MapPin, title: "Nationwide Reach", subtitle: "Fast Delivery" },
];

const pitchSteps = [
  {
    icon: Search,
    index: "01",
    title: "Explore the range",
    description: "Find the right category, product family and key specifications without a long sales call.",
  },
  {
    icon: ClipboardList,
    index: "02",
    title: "Build one request",
    description: "Add several tools to one clear enquiry instead of sending scattered screenshots and messages.",
  },
  {
    icon: MessagesSquare,
    index: "03",
    title: "Continue with sales",
    description: "Starlite confirms availability, pricing and the next step directly through WhatsApp.",
  },
];

const p20sProduct =
  products.find((product) => product.id === "ingco-CKLI2010") ??
  products.find((product) => product.id === "ingco-CDLI20012");

export default function HomePage() {
  return (
    <>
      <DualBrandHero />

      {/* SHOP BY INDUSTRY */}
      <section id="industries" className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <SectionMarker index="02" label="Built For The Trade" />
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase text-brand-white sm:text-3xl">
                Shop by Industry
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1.5 text-sm font-semibold text-brand-steel hover:text-brand-orange sm:flex"
            >
              View all industries <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden border border-brand-border bg-brand-border sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => {
              const Icon = industryIcons[industry.slug] ?? Wrench;
              const count = products.filter((p) => p.industryIds.includes(industry.id)).length;
              const categorySlug = industryCategorySlugs[industry.slug] ?? "hand-tools";
              return (
                <Link
                  key={industry.id}
                  href={`/products?industry=${industry.slug}`}
                  className="group relative min-h-[320px] overflow-hidden bg-brand-surface transition hover:bg-brand-surface-raised"
                >
                  <ProductVisual
                    categorySlug={categorySlug}
                    categoryName={industry.name}
                    className="absolute inset-0"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    imageClassName="translate-y-[12%] scale-[1.08] p-[14%] opacity-85 group-hover/visual:scale-[1.12]"
                  />
                  <div className="absolute inset-0 z-20 bg-gradient-to-b from-brand-graphite/15 via-brand-graphite/25 to-brand-graphite" />
                  <div className="absolute inset-x-0 bottom-0 z-30 p-5">
                    <span className="flex h-8 w-8 items-center justify-center border border-brand-orange/50 bg-brand-graphite/75">
                      <Icon className="h-4 w-4 text-brand-orange" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-bold uppercase leading-tight text-brand-white">
                      {industry.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim">
                      <span>{count} products</span>
                      <span className="text-brand-orange">Explore / 0{industries.indexOf(industry) + 1}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* P20S SYSTEM BANNER */}
      <section className="border-b border-brand-border bg-brand-navy">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="relative grid overflow-hidden border border-brand-border bg-brand-graphite lg:grid-cols-[1.08fr_0.92fr]">
            <div className="absolute inset-0 technical-grid opacity-35" />
            <div className="relative min-h-[390px] border-b border-brand-border lg:border-b-0 lg:border-r">
              {p20sProduct ? (
                <ProductVisual
                  product={p20sProduct}
                  categorySlug="cordless-tools"
                  categoryName="INGCO P20S System"
                  className="absolute inset-0"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  imageClassName="scale-[1.03] p-[7%]"
                />
              ) : null}
              <span className="absolute left-5 top-5 z-30 border border-brand-ingco-yellow bg-brand-ingco-yellow px-3 py-1.5 font-heading text-sm font-extrabold uppercase tracking-[0.08em] text-brand-graphite">
                INGCO / P20S
              </span>
              <span className="absolute bottom-5 right-5 z-30 font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim">
                One battery / multiple tools
              </span>
            </div>
            <div className="relative flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <SectionMarker index="03" label="INGCO P20S System" tone="ingco" />
              <h2 className="mt-3 max-w-lg font-heading text-4xl font-extrabold uppercase leading-[0.96] text-brand-white">
                One platform.
                <br />
                <span className="text-brand-ingco-yellow">More ways to work.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-steel">
                The intelligent 20V platform that powers 150+ tools across multiple
                categories. One battery, multiple tools — buy the platform once and expand
                your kit tool by tool.
              </p>
              <div className="mt-6 grid max-w-md grid-cols-3 border border-brand-border">
                {[
                  ["20V", "Platform"],
                  ["150+", "Tool options"],
                  ["01", "Battery family"],
                ].map(([value, label]) => (
                  <div key={label} className="border-r border-brand-border p-3 last:border-r-0">
                    <p className="font-heading text-xl font-extrabold text-brand-white">{value}</p>
                    <p className="font-mono-meta text-[8px] uppercase tracking-[0.12em] text-brand-steel-dim">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/products?category=cordless-tools"
                className="mt-7 inline-flex w-fit items-center gap-2 bg-brand-ingco-yellow px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
              >
                Explore P20S System
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PITCH JOURNEY — keeps the homepage focused while the catalogue carries the products */}
      <section className="technical-grid border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <SectionMarker index="04" label="Simple By Design" />
            <h2 className="mt-3 max-w-lg font-heading text-4xl font-extrabold uppercase leading-[0.96] text-brand-white">
              From catalogue
              <br />
              <span className="text-brand-orange">to conversation.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-brand-steel">
              The homepage introduces the business and the buying path. The full product
              range stays where it belongs — inside the searchable catalogue.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
              >
                Open Catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-orange"
              >
                Build a Request
              </Link>
            </div>
          </div>

          <div className="grid gap-px border border-brand-border bg-brand-border md:grid-cols-3">
            {pitchSteps.map(({ icon: Icon, index, title, description }) => (
              <article
                key={index}
                className="relative min-h-64 overflow-hidden bg-brand-surface p-6"
              >
                <span className="absolute right-4 top-3 font-heading text-7xl font-extrabold leading-none text-white/[0.025]">
                  {index}
                </span>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center border border-brand-orange/50 bg-brand-graphite">
                    <Icon className="h-5 w-5 text-brand-orange" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono-meta text-[9px] uppercase tracking-[0.18em] text-brand-orange">
                    Step / {index}
                  </span>
                </div>
                <h3 className="mt-12 font-heading text-xl font-bold uppercase text-brand-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-steel">
                  {description}
                </p>
                <div className="absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-brand-orange/70 to-transparent" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px border-x border-brand-border bg-brand-border sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3 bg-brand-graphite-light px-5 py-8">
              <Icon className="h-8 w-8 shrink-0 text-brand-orange" strokeWidth={1.5} />
              <div>
                <p className="font-heading text-sm font-bold text-brand-white">{title}</p>
                <p className="text-xs text-brand-steel-dim">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="technical-grid border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <SectionMarker index="05" label="About Starlite Tools" />
            <h2 className="mt-2 max-w-xl font-heading text-4xl font-extrabold uppercase leading-[0.98] text-brand-white">
              Built in the market. Ready for the next scale.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-steel">
              {businessSettings.legalName} has served the industrial, construction and
              technical communities in Nigeria with quality tools and reliable service.
              This digital showroom brings that offline strength online — for customers,
              dealers and bulk buyers who want to find products and request quotes faster.
            </p>
            <ul className="mt-6 grid gap-px border border-brand-border bg-brand-border text-sm text-brand-steel sm:grid-cols-2">
              <li className="flex items-center gap-2 bg-brand-surface p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Onitsha tools market presence
              </li>
              <li className="flex items-center gap-2 bg-brand-surface p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Multi-brand industrial supplier
              </li>
              <li className="flex items-center gap-2 bg-brand-surface p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Dealer &amp; project support
              </li>
              <li className="flex items-center gap-2 bg-brand-surface p-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Technical sales assistance
              </li>
            </ul>
          </div>

          <div className="relative min-h-[460px] overflow-hidden border border-brand-border bg-brand-surface">
            <ProductVisual
              categorySlug="hand-tools"
              categoryName="Professional industrial tools"
              className="absolute inset-0"
              sizes="(min-width: 1024px) 50vw, 100vw"
              imageClassName="scale-[1.02] p-[10%]"
            />
            <div className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-px bg-brand-border sm:grid-cols-4 lg:grid-cols-2">
              {[
                [businessSettings.yearsInBusiness, "Years in Business"],
                [businessSettings.productsSupplied, "Products Supplied"],
                [businessSettings.dealerPartners, "Dealer Partners"],
                [businessSettings.coverage, "Supply Hub"],
              ].map(([stat, label]) => (
                <div key={label} className="bg-brand-graphite/95 p-4 backdrop-blur">
                  <p className="font-heading text-2xl font-extrabold text-brand-orange">{stat}</p>
                  <p className="mt-1 font-mono-meta text-[8px] uppercase tracking-[0.12em] text-brand-steel-dim">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactMap />
    </>
  );
}
