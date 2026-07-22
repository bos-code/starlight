"use client";

import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Wrench } from "lucide-react";
import type { SiteImage } from "@/data/site-images";

interface ImageSlotProps {
  image: SiteImage;
  icon?: LucideIcon;
  label?: string;
  className?: string;
  iconClassName?: string;
  sizes?: string;
  /** Set false to show only the texture/gradient (no centered icon) — for subtle backgrounds. */
  showIconFallback?: boolean;
  /** Set false to remove the gradient background (e.g. when parent supplies its own). */
  showGradient?: boolean;
}

/**
 * Renders a real image when one has been supplied in data/site-images.ts, and a
 * designed placeholder (never a broken image) otherwise — or if the real image
 * fails to load at runtime.
 */
export function ImageSlot({
  image,
  icon: Icon = Wrench,
  label,
  className = "",
  iconClassName = "h-10 w-10",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  showIconFallback = true,
  showGradient = true,
}: ImageSlotProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image.src) && !failed;

  return (
    <div
      className={`relative overflow-hidden ${showGradient ? "bg-gradient-to-br from-brand-navy-light via-brand-navy to-brand-graphite-light" : ""} ${className}`}
    >
      {showImage ? (
        <Image
          src={image.src!}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="grid-texture absolute inset-0 opacity-40" />
          {showIconFallback && (
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
              <Icon className={`text-brand-steel/70 ${iconClassName}`} strokeWidth={1.25} />
              {label && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-brand-steel/60">
                  {label}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
