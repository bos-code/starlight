import Link from "next/link";
import { ArrowRight, ArrowUpRight, Box, ShieldCheck, Truck } from "lucide-react";
import { products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { SectionMarker } from "@/components/brand/SectionMarker";
import { ProductVisual } from "@/components/ProductVisual";
import { HeroProductAnnotations } from "./hero-product-annotations";

const heroProduct = products.find((product) => product.id === "ingco-CIWLI2001") ?? products[0];

const supplyPoints = [
  { icon: Box, label: "Multi-brand catalogue", value: "190+ SKUs" },
  { icon: ShieldCheck, label: "Product support", value: "Trade ready" },
  { icon: Truck, label: "Supply reach", value: "Nigeria" },
];

export function DualBrandHero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-graphite">
      <div className="technical-grid pointer-events-none absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/80 to-transparent" />

      <div className="relative mx-auto grid max-w-[1440px] lg:min-h-[650px] lg:grid-cols-[0.88fr_1.12fr]">
        {/* STARLITE: market, supply and service layer */}
        <div className="relative z-20 flex flex-col justify-center border-b border-brand-border px-6 py-14 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-20 xl:px-16">
          <div className="absolute right-0 top-0 hidden h-full w-5 overflow-hidden lg:block">
            <div className="absolute right-0 top-0 h-[42%] w-px bg-brand-orange/80" />
            <div className="absolute right-0 top-[42%] h-10 w-5 border-b border-l border-brand-orange/80" />
            <div className="absolute bottom-0 right-5 h-[calc(58%-2.5rem)] w-px bg-brand-orange/35" />
          </div>

          <SectionMarker index="STL / 01" label="Industrial Supply Network" />
          <p className="mt-6 font-mono-meta text-[10px] uppercase tracking-[0.24em] text-brand-steel-dim">
            Onitsha hub / dealer desk / nationwide enquiries
          </p>
          <h1 className="mt-4 max-w-xl font-heading text-5xl font-extrabold uppercase leading-[0.91] tracking-[-0.02em] text-brand-white sm:text-6xl xl:text-7xl">
            Tools built
            <br />
            for work that
            <br />
            <span className="text-brand-orange">cannot fail.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-brand-steel sm:text-base">
            Starlite brings professional tools, technical support and dealer supply into
            one fast catalogue-to-quote system for contractors, workshops and businesses.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-brand-graphite transition hover:brightness-110"
            >
              Browse Catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface/60 px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-brand-white transition hover:border-brand-orange"
            >
              Build a Quote
            </Link>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 border border-brand-border bg-brand-border">
            {supplyPoints.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-brand-graphite p-3 sm:p-4">
                <Icon className="h-4 w-4 text-brand-orange" strokeWidth={1.5} />
                <p className="mt-3 font-heading text-sm font-bold uppercase text-brand-white">
                  {value}
                </p>
                <p className="mt-0.5 font-mono-meta text-[7px] uppercase tracking-[0.11em] text-brand-steel-dim sm:text-[8px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INGCO: featured product system */}
        <div className="relative min-h-[560px] overflow-hidden bg-[#0d100f] lg:min-h-0">
          <ProductVisual
            product={heroProduct}
            categorySlug="cordless-tools"
            categoryName="INGCO P20S Cordless System"
            className="absolute inset-0"
            sizes="(min-width: 1024px) 62vw, 100vw"
            imageClassName="translate-x-[2%] translate-y-[1%] scale-[1.04] p-[9%] sm:p-[11%] lg:-translate-x-[3%] lg:scale-[1.1] lg:p-[8%]"
            priority
          />

          <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(12,15,14,0.7)_0%,transparent_28%,transparent_70%,rgba(12,15,14,0.52)_100%)]" />
          <div className="pointer-events-none absolute right-5 top-20 z-20 font-heading text-[22vw] font-extrabold leading-none tracking-[-0.08em] text-white/[0.025] lg:text-[10rem]">
            INGCO
          </div>

          <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-brand-border bg-brand-graphite/78 px-5 py-3 backdrop-blur sm:px-7">
            <div className="flex items-center gap-3">
              <span className="bg-brand-ingco-yellow px-3 py-1 font-heading text-sm font-extrabold uppercase tracking-[0.08em] text-brand-graphite">
                INGCO
              </span>
              <span className="font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim">
                P20S / Product platform
              </span>
            </div>
            <span className="hidden font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim sm:block">
              Supplied by Starlite
            </span>
          </div>

          {/* The bridge makes the split read as a commercial handoff, not two unrelated brands. */}
          <div className="absolute left-0 top-1/2 z-40 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
            <div className="flex h-48 w-9 items-center justify-center border border-brand-orange bg-brand-graphite shadow-[0_0_35px_rgba(249,115,22,0.2)]">
              <span className="-rotate-90 whitespace-nowrap font-mono-meta text-[8px] font-semibold uppercase tracking-[0.2em] text-brand-orange">
                Starlite supply / INGCO system
              </span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-30 grid border-t border-brand-border bg-brand-graphite/90 backdrop-blur md:grid-cols-[1fr_auto]">
            <div className="p-5 sm:p-6">
              <p className="font-mono-meta text-[9px] uppercase tracking-[0.16em] text-brand-ingco-yellow">
                Featured system / {heroProduct.model}
              </p>
              <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase text-brand-white sm:text-3xl">
                {heroProduct.name}
              </h2>
              <div className="mt-3">
                <HeroProductAnnotations product={heroProduct} />
              </div>
            </div>
            <Link
              href="/products?brand=ingco"
              className="flex min-w-44 items-center justify-center gap-2 border-t border-brand-border bg-brand-ingco-yellow px-6 py-5 font-heading text-base font-extrabold uppercase text-brand-graphite transition hover:brightness-110 md:border-l md:border-t-0"
            >
              Explore INGCO
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">{businessSettings.legalName} — featuring INGCO tools.</p>
    </section>
  );
}
