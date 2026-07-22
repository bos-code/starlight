import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  Flame,
  Hammer,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import { industries, products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { ProductCard } from "@/components/ProductCard";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { DualBrandHero } from "@/components/home/dual-brand-hero";
import { SectionMarker } from "@/components/brand/SectionMarker";

const industryIcons: Record<string, typeof Building2> = {
  construction: Building2,
  "welding-fabrication": Flame,
  "carpentry-woodworking": Hammer,
  "electrical-installation": Zap,
};

const trustPoints = [
  { icon: ShieldCheck, title: "Original Tools", subtitle: "100% Genuine" },
  { icon: BatteryCharging, title: "Warranty Support", subtitle: "Peace of Mind" },
  { icon: Truck, title: "Bulk & Projects", subtitle: "Special Pricing" },
  { icon: MapPin, title: "Nationwide Reach", subtitle: "Fast Delivery" },
];

const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => {
              const Icon = industryIcons[industry.slug] ?? Wrench;
              const count = products.filter((p) => p.industryIds.includes(industry.id)).length;
              return (
                <Link
                  key={industry.id}
                  href={`/products?industry=${industry.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-brand-border bg-brand-surface p-6 transition hover:border-brand-orange/50"
                >
                  <Icon className="h-8 w-8 text-brand-orange" strokeWidth={1.5} />
                  <h3 className="mt-4 font-heading text-lg font-bold text-brand-white">
                    {industry.name}
                  </h3>
                  <p className="mt-1 text-xs text-brand-steel-dim">{count} products</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* P20S SYSTEM BANNER */}
      <section className="border-b border-brand-border bg-brand-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <ProductImagePlaceholder
            categorySlug="cordless-tools"
            className="aspect-[4/3] w-full rounded-2xl"
            iconClassName="h-16 w-16"
          />
          <div>
            <SectionMarker index="03" label="INGCO P20S System" tone="ingco" />
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase text-brand-white">
              One Platform, More Ways to Work.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-steel">
              The intelligent 20V platform that powers 150+ tools across multiple
              categories. One battery, multiple tools — buy the platform once and expand
              your kit tool by tool.
            </p>
            <Link
              href="/products?category=cordless-tools"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-ingco-yellow px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
            >
              Explore P20S System
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <SectionMarker index="04" label="Top Sellers" />
              <h2 className="mt-2 font-heading text-2xl font-bold uppercase text-brand-white sm:text-3xl">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1.5 text-sm font-semibold text-brand-steel hover:text-brand-orange sm:flex"
            >
              View full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
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
      <section className="grid-texture-ivory border-b border-brand-ivory-border bg-brand-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <div>
            <SectionMarker index="05" label="About Starlite Tools" tone="light" />
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase leading-tight text-brand-ivory-ink">
              Built in the market. Ready for the next scale.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-ivory-ink-dim">
              {businessSettings.legalName} has served the industrial, construction and
              technical communities in Nigeria with quality tools and reliable service.
              This digital showroom brings that offline strength online — for customers,
              dealers and bulk buyers who want to find products and request quotes faster.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-ivory-ink-dim">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Onitsha tools market presence
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Multi-brand industrial supplier
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Dealer &amp; project support
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Technical sales assistance
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              [businessSettings.yearsInBusiness, "Years in Business"],
              [businessSettings.productsSupplied, "Products Supplied"],
              [businessSettings.dealerPartners, "Dealer Partners"],
              [businessSettings.coverage, "Onitsha Supply Hub"],
            ].map(([stat, label]) => (
              <div
                key={label}
                className="rounded-xl border border-brand-ivory-border bg-brand-ivory-raised p-6 text-center"
              >
                <p className="font-heading text-3xl font-extrabold text-brand-orange">{stat}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand-ivory-ink-dim">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="support" className="bg-brand-graphite">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionMarker index="06" label="Get in Touch" />
            <h2 className="mt-2 font-heading text-3xl font-bold uppercase text-brand-white">
              Contact &amp; Location
            </h2>
            <p className="mt-3 max-w-md text-sm text-brand-steel">
              Our team is ready to assist with product enquiries, quotes and technical
              support.
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <div>
                  <p className="text-brand-white">{businessSettings.whatsappDisplay}</p>
                  <p className="text-brand-white">{businessSettings.phoneDisplay}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-brand-white">
                  {businessSettings.address}, {businessSettings.state}, {businessSettings.country}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-brand-white">{businessSettings.hours}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="grid-texture flex min-h-[280px] items-center justify-center rounded-2xl border border-brand-border bg-brand-surface">
            <div className="flex flex-col items-center gap-2 text-brand-steel-dim">
              <MapPin className="h-10 w-10 text-brand-orange" strokeWidth={1.5} />
              <p className="text-sm font-medium text-brand-steel">
                {businessSettings.address}
              </p>
              <p className="text-xs">Map preview</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
