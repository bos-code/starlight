"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { getProductVisual } from "@/lib/product-images";

interface ProductVisualProps {
  product?: Pick<
    Product,
    | "name"
    | "productType"
    | "powerSource"
    | "categoryId"
    | "sku"
    | "imageUrl"
    | "imageSourceUrl"
  >;
  categorySlug?: string;
  categoryName?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  showReferenceLabel?: boolean;
}

function ResilientProductImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  priority: boolean;
  className: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const isRemote = currentSrc.startsWith("http://") || currentSrc.startsWith("https://");

  useEffect(() => {
    if (!isRemote || !fallbackSrc || currentSrc === fallbackSrc || loaded) return;

    const fallbackTimer = window.setTimeout(() => {
      setCurrentSrc(fallbackSrc);
    }, 12_000);

    return () => window.clearTimeout(fallbackTimer);
  }, [currentSrc, fallbackSrc, isRemote, loaded]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isRemote}
      loading={isRemote && !priority ? "eager" : undefined}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setLoaded(false);
          setCurrentSrc(fallbackSrc);
        }
      }}
      className={className}
    />
  );
}

export function ProductVisual({
  product,
  categorySlug,
  categoryName,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  showReferenceLabel = false,
}: ProductVisualProps) {
  const visual = getProductVisual(product, categorySlug);
  const positionClass = className.split(/\s+/).includes("absolute") ? "" : "relative";
  const alt = product
    ? visual.match === "exact"
      ? `${product.name} ${product.sku} product image`
      : `${product.name} — illustrative product visual`
    : `${categoryName ?? visual.label} — illustrative product visual`;

  return (
    <div
      className={`product-stage group/visual ${positionClass} isolate overflow-hidden bg-brand-surface ${className}`}
    >
      <div className="technical-grid pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-brand-orange/10 blur-3xl transition duration-500 group-hover/visual:bg-brand-orange/16" />
      <ResilientProductImage
        key={visual.src}
        src={visual.src}
        fallbackSrc={visual.fallbackSrc}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`relative z-10 object-contain p-[9%] drop-shadow-[0_22px_32px_rgba(0,0,0,0.72)] transition duration-500 group-hover/visual:scale-[1.025] ${imageClassName}`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-orange/55 to-transparent" />
      {showReferenceLabel ? (
        <span className="absolute bottom-3 left-3 z-20 border border-brand-border/80 bg-brand-graphite/85 px-2 py-1 font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-steel-dim backdrop-blur">
          {visual.match === "exact"
            ? "Model image / confirm supplied configuration"
            : "Reference visual / confirm exact model"}
        </span>
      ) : null}
    </div>
  );
}
