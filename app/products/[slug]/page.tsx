import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getBrand, getCategory, getProductBySlug, getRelatedProducts, products } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { ProductImagePlaceholder } from "@/components/ProductImagePlaceholder";
import { ProductDetailActions } from "@/components/ProductDetailActions";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { buildDealerPriceRequestUrl, buildProductEnquiryUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Starlite Tools" };
  return {
    title: `${product.name} | Starlite Tools`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const brand = getBrand(product.brandId);
  const category = getCategory(product.categoryId);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-brand-steel-dim">
        <Link href="/" className="hover:text-brand-white">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-white">Products</Link>
        {category && (
          <>
            <span>/</span>
            <Link href={`/products?category=${category.slug}`} className="hover:text-brand-white">
              {category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-brand-white">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery: vertical thumbnails + large primary image */}
        <div className="flex gap-3">
          <div className="flex w-16 shrink-0 flex-col gap-2.5 sm:w-20">
            {[0, 1, 2, 3].map((i) => (
              <ProductImagePlaceholder
                key={i}
                categorySlug={category?.slug ?? ""}
                className={`aspect-square w-full rounded-lg ${i === 0 ? "ring-2 ring-brand-orange" : "opacity-70"}`}
                iconClassName="h-5 w-5"
              />
            ))}
          </div>
          <ProductImagePlaceholder
            categorySlug={category?.slug ?? ""}
            categoryName={category?.name}
            className="aspect-square w-full flex-1 rounded-2xl"
            iconClassName="h-24 w-24"
          />
        </div>

        {/* Sticky quotation panel */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={product.availabilityStatus} />
            {product.isFeatured && (
              <span className="inline-flex items-center rounded-full bg-brand-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-graphite">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-3 font-heading text-3xl font-bold text-brand-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-steel">
            <span>
              SKU <span className="font-mono-meta text-brand-white">{product.sku}</span>
            </span>
            <span>
              Brand <span className="text-brand-white">{brand?.name}</span>
            </span>
          </div>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-steel">
            {product.shortDescription}
          </p>

          <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-steel-dim">
              Price
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-brand-orange">
              Request Quote — Contact for Pricing
            </p>
            <ul className="mt-3 space-y-1 text-xs text-brand-steel-dim">
              <li>Bulk / wholesale pricing available on request</li>
              <li>Delivery timelines confirmed by the sales team per order</li>
            </ul>
          </div>

          <div className="mt-6">
            <ProductDetailActions product={product} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <a
              href={buildProductEnquiryUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-brand-border py-3 text-xs font-bold uppercase tracking-wide text-brand-white transition hover:border-emerald-400 hover:text-emerald-400"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
            <a
              href={buildDealerPriceRequestUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-brand-border py-3 text-xs font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-orange hover:text-brand-orange"
            >
              Request Dealer Price
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-brand-border pt-6 sm:grid-cols-3">
            {product.specs
              .filter((s) => s.label !== "Feature")
              .slice(0, 6)
              .map((spec) => (
                <div key={spec.label}>
                  <dt className="text-[11px] uppercase tracking-wide text-brand-steel-dim">
                    {spec.label}
                  </dt>
                  <dd className="mt-0.5 text-sm font-medium text-brand-white">{spec.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <div className="mt-16 border-t border-brand-border pt-10">
          <h2 className="mb-6 font-heading text-xl font-bold uppercase text-brand-white">
            You may also need
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
