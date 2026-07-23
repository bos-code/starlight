import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/data";
import { businessSettings } from "@/config/business";
import { siteImages } from "@/data/site-images";
import { SectionMarker } from "@/components/brand/SectionMarker";
import { ImageSlot } from "@/components/ImageSlot";
import { LightningDivider } from "./lightning-divider";
import { HeroProductAnnotations } from "./hero-product-annotations";
import { HeroStatusRail } from "./hero-status-rail";

const heroProduct = products.find((p) => p.id === "ingco-CIWLI2001") ?? products[0];

export function DualBrandHero() {
  return (
    <section className="relative overflow-hidden border-b border-brand-border bg-brand-graphite">
      {/*
        Desktop: two ordinary, non-overlapping grid columns (~64/36) with a fixed-
        width decorative fracture band between them. Content never needs to avoid a
        jagged edge — the fracture is confined to its own band, so it can be as
        irregular as we like without ever colliding with text or images.
      */}
      <div className="hidden lg:grid lg:grid-cols-[64fr_4.5rem_36fr]">
        <div className="flex flex-col justify-center bg-brand-graphite px-12 py-20 xl:px-16">
          <SectionMarker index="01" label="Digital Showroom" />
          <h1 className="mt-5 max-w-lg font-heading text-4xl font-extrabold uppercase leading-[1.05] text-brand-white xl:text-5xl">
            Tools and supply for work
            <br />
            that <span className="text-brand-orange">cannot wait.</span>
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
          <div className="mt-10">
            <HeroStatusRail />
          </div>
        </div>

        <div className="relative z-10">
          <LightningDivider orientation="vertical" />
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,var(--color-orange-dim)_0%,var(--color-graphite)_70%)] px-8 py-20">
          <SectionMarker index="Featured Product System" label="INGCO" tone="ingco" />
          <div className="relative mt-5 aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-brand-ingco-yellow/20">
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
          <div className="mt-3">
            <HeroProductAnnotations product={heroProduct} />
          </div>
          <Link
            href="/products?brand=ingco"
            className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand-ingco-yellow hover:underline"
          >
            Explore INGCO Tools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mobile / tablet: stacked, thin horizontal fracture band between blocks */}
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

        <div className="relative h-10 w-full overflow-hidden bg-gradient-to-b from-brand-graphite to-brand-orange-dim/25">
          <LightningDivider orientation="horizontal" />
        </div>

        <div className="bg-[radial-gradient(circle_at_50%_0%,var(--color-orange-dim)_0%,var(--color-graphite)_70%)] px-6 py-12">
          <SectionMarker index="Featured Product System" label="INGCO" tone="ingco" />
          <div className="relative mx-auto mt-5 aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl border border-brand-ingco-yellow/20">
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
          <div className="mt-3">
            <HeroProductAnnotations product={heroProduct} />
          </div>
          <Link
            href="/products?brand=ingco"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-brand-ingco-yellow hover:underline"
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
