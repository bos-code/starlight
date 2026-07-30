"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ClipboardList,
  Headphones,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { useQuote } from "@/lib/quote-context";
import { businessSettings } from "@/config/business";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/products?brand=all", label: "Brands" },
  { href: "/#industries", label: "Industries" },
  { href: "/dealer", label: "Dealers" },
  { href: "/about#support", label: "Support" },
  { href: "/about", label: "About Us" },
];

export function Header() {
  const { itemCount } = useQuote();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-graphite/95 backdrop-blur-xl">
      <div className="hidden border-b border-brand-border/70 bg-[#07100e] text-brand-steel md:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2">
          <div className="flex items-center gap-5 font-heading text-[11px] font-semibold tracking-[0.02em]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-green" />
              Trusted by Professionals
            </span>
            <span className="h-4 w-px bg-brand-border" />
            <span className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-brand-green" />
              Nationwide Enquiries
            </span>
            <span className="h-4 w-px bg-brand-border" />
            <span className="flex items-center gap-2">
              <Headphones className="h-3.5 w-3.5 text-brand-green" />
              Expert Support
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono-meta text-[9px] uppercase tracking-[0.08em]">
            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition hover:text-brand-white"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-brand-green" />
              {businessSettings.whatsappDisplay}
            </a>
            <span className="h-4 w-px bg-brand-border" />
            <a
              href={`mailto:${businessSettings.email}`}
              className="flex items-center gap-1.5 transition hover:text-brand-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {businessSettings.email}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-6 py-3.5">
        <Link href="/" className="shrink-0" aria-label="Starlite Tools home">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks.map((link) => {
            const pathOnly = link.href.split(/[?#]/)[0];
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href === "/products"
                  ? pathname.startsWith("/products")
                  : pathname === pathOnly;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.04em] transition ${
                  isActive
                    ? "text-brand-orange after:absolute after:inset-x-0 after:-bottom-3.5 after:h-0.5 after:bg-brand-orange"
                    : "text-brand-white/80 hover:text-brand-orange"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center border border-brand-border bg-brand-surface px-3 py-2.5 lg:flex xl:max-w-[270px]">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products, categories..."
            className="w-full min-w-0 bg-transparent pr-2 text-sm text-brand-white placeholder:text-brand-steel-dim focus:outline-none"
          />
          <Search className="h-4 w-4 shrink-0 text-brand-white" />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/quote"
            className="relative hidden items-center gap-2 border border-brand-border px-3 py-2.5 font-heading text-sm font-semibold uppercase text-brand-white transition hover:border-brand-orange lg:flex"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Quote List</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-brand-orange px-1 text-[11px] font-bold text-brand-graphite">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/quote"
            className="flex items-center gap-2 bg-brand-orange px-4 py-2.5 font-heading text-sm font-extrabold uppercase tracking-[0.04em] text-brand-graphite transition hover:brightness-110 sm:px-5"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Request Quotation</span>
            <span className="sm:hidden">Quote</span>
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center border border-brand-border text-brand-white xl:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-border bg-brand-graphite px-6 py-4 xl:hidden">
          <div className="mb-4 flex items-center border border-brand-border bg-brand-surface px-3 py-2.5">
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products..."
              className="w-full bg-transparent pr-2 text-sm text-brand-white placeholder:text-brand-steel-dim focus:outline-none"
            />
            <Search className="h-4 w-4 shrink-0 text-brand-white" />
          </div>
          <nav className="grid sm:grid-cols-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-brand-border px-3 py-3 font-heading text-sm font-semibold uppercase text-brand-steel transition hover:bg-brand-surface hover:text-brand-orange sm:border-r"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
