import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { siteImages } from "@/data/site-images";
import { SectionMarker } from "@/components/brand/SectionMarker";
import { ImageSlot } from "@/components/ImageSlot";
import { LightningDivider, getVerticalClipPolygons, getHorizontalClipPolygons } from "./lightning-divider";
import { HeroProductAnnotations } from "./hero-product-annotations";
import { HeroStatusRail } from "./hero-status-rail";

const heroProduct = products.find((p) => p.id === "ingco-CIWLI2001") ?? products[0];

export function DualBrandHero() {
  const { left: leftClip, right: rightClip } = getVerticalClipPolygons();
  const { top: topClip, bottom: bottomClip } = getHorizontalClipPolygons();

  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-graphite">
      {/* ---------- Desktop: asymmetric split with lightning fracture ---------- */}
      <div className="relative hidden min-h-[640px] lg:block">
        {/* Starlite background zone (~65-70%) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(${leftClip})` }}
        >
          <ImageSlot
            image={siteImages.hero.starliteEnvironment}
            className="h-full w-full"
            showIconFallback={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-graphite via-brand-graphite/95 to-brand-graphite/60" />
        </div>

        {/* INGCO background zone (~30-35%) — deeper orange/amber, dark product-stage lighting */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `polygon(${rightClip})` }}
        >
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_35%,var(--color-orange-dim)_0%,var(--color-graphite)_65%)]" />
          <div className="absolute inset-0 bg-brand-graphite/40" />
        </div>

        <LightningDivider orientation="vertical" />

        {/* Foreground content — normal flow, not clipped, so text is always readable */}
        <div className="relative grid h-full min-h-[640px] grid-cols-[62%_38%]">
          <div className="flex flex-col justify-center px-6 py-16 pr-10 lg:px-12 lg:pr-14">
            <SectionMarker index="01" label="Digital Showroom" />
            <h1 className="mt-5 font-heading text-4xl font-extrabold uppercase leading-[1.05] text-brand-white xl:text-5xl">
              Tools and supply
              <br />
              for work that
              <br />
              <span className="text-brand-orange">cannot wait.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-steel">
              Power tools, hand tools, welding equipment, safety products and
              industrial supplies for dealers, technicians, contractors and
              businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
              >
                Browse Catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-white"
              >
                Build a Quote
              </Link>
            </div>
            <div className="mt-10 max-w-md">
              <HeroStatusRail />
            </div>
          </div>

          <div className="relative flex flex-col justify-center px-6 py-16 lg:px-8">
            <SectionMarker index="Featured Product System" label="INGCO" tone="ingco" />

            <div className="relative mt-5 -ml-6 lg:-ml-10">
              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-brand-ingco-yellow/20">
                <ImageSlot
                  image={siteImages.hero.ingcoFeaturedProduct}
                  iconClassName="h-24 w-24"
                  className="h-full w-full"
                />
              </div>
            </div>

            <h2 className="mt-5 font-heading text-lg font-bold text-brand-white">
              {heroProduct.name}
            </h2>
            <p className="text-xs text-brand-steel-dim">Model {heroProduct.model}</p>

            <div className="mt-4">
              <HeroProductAnnotations product={heroProduct} />
            </div>

            <Link
              href="/products?brand=ingco"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand-ingco-yellow hover:underline"
            >
              Explore INGCO Tools
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Mobile / tablet: stacked, horizontal fracture ---------- */}
      <div className="lg:hidden">
        <div className="px-6 py-12">
          <SectionMarker index="01" label="Digital Showroom" />
          <h1 className="mt-5 font-heading text-4xl font-extrabold uppercase leading-[1.05] text-brand-white">
            Tools and supply for work that{" "}
            <span className="text-brand-orange">cannot wait.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-brand-steel">
            Power tools, hand tools, welding equipment, safety products and
            industrial supplies for dealers, technicians, contractors and
            businesses.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite"
            >
              Browse Catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white"
            >
              Build a Quote
            </Link>
          </div>
          <div className="mt-10">
            <HeroStatusRail />
          </div>
        </div>

        <div className="relative h-14 w-full overflow-hidden">
          <div className="absolute inset-0 bg-brand-graphite" style={{ clipPath: `polygon(${topClip})` }} />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,var(--color-orange-dim)_0%,var(--color-graphite)_75%)]"
            style={{ clipPath: `polygon(${bottomClip})` }}
          />
          <LightningDivider orientation="horizontal" />
        </div>

        <div className="bg-[radial-gradient(circle_at_50%_0%,var(--color-orange-dim)_0%,var(--color-graphite)_70%)] px-6 py-12">
          <SectionMarker index="Featured Product System" label="INGCO" tone="ingco" />
          <div className="relative mx-auto mt-5 aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl border border-brand-ingco-yellow/20">
            <ImageSlot
              image={siteImages.hero.ingcoFeaturedProduct}
              iconClassName="h-20 w-20"
              className="h-full w-full"
            />
          </div>
          <h2 className="mt-5 font-heading text-lg font-bold text-brand-white">
            {heroProduct.name}
          </h2>
          <p className="text-xs text-brand-steel-dim">Model {heroProduct.model}</p>
          <div className="mt-4">
            <HeroProductAnnotations product={heroProduct} />
          </div>
          <Link
            href="/products?brand=ingco"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand-ingco-yellow hover:underline"
          >
            Explore INGCO Tools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <p className="sr-only">{businessSettings.legalName} — featuring INGCO Tools.</p>
    </section>
  );
}
