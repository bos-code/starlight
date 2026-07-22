"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClipboardList, Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { StarMark } from "./brand/StarMark";
import { useQuote } from "@/lib/quote-context";
import { businessSettings } from "@/config/business";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/products?brand=all", label: "Brands" },
  { href: "/#industries", label: "Industries" },
  { href: "/dealer", label: "Dealers" },
  { href: "/about#support", label: "Support" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { itemCount } = useQuote();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-graphite/95 backdrop-blur">
      <div className="hidden border-b border-brand-border/70 bg-brand-navy/60 text-[11px] text-brand-steel md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <span className="font-mono-meta flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            STL SYS: ONLINE &nbsp;·&nbsp; {businessSettings.address}, {businessSettings.state}, NG
          </span>
          <span className="font-mono-meta">{businessSettings.hours}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive = link.href === pathname || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0].split("#")[0]) && link.href.split("?")[0].split("#")[0] !== "/");
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  isActive ? "text-brand-white" : "text-brand-steel hover:text-brand-white"
                }`}
              >
                {isActive && <StarMark className="h-2.5 w-2.5 text-brand-orange" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 items-center rounded-lg border border-brand-border bg-brand-surface px-3 py-2 md:flex lg:max-w-xs">
          <Search className="h-4 w-4 shrink-0 text-brand-steel-dim" />
          <input
            type="search"
            placeholder="Search product, brand, model, SKU..."
            className="w-full bg-transparent px-2 text-sm text-brand-white placeholder:text-brand-steel-dim focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/quote"
            className="relative flex items-center gap-2 rounded-lg border border-brand-border px-3 py-2 text-sm font-semibold text-brand-white transition hover:border-brand-orange"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Quote List</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-[11px] font-bold text-brand-graphite">
                {itemCount}
              </span>
            )}
          </Link>

          <a
            href={`https://wa.me/${businessSettings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-bold text-brand-graphite transition hover:brightness-110 sm:flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-brand-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-border bg-brand-graphite px-6 py-4 lg:hidden">
          <div className="mb-4 flex items-center rounded-lg border border-brand-border bg-brand-surface px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-brand-steel-dim" />
            <input
              type="search"
              placeholder="Search products..."
              className="w-full bg-transparent px-2 text-sm text-brand-white placeholder:text-brand-steel-dim focus:outline-none"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-brand-steel hover:bg-brand-surface hover:text-brand-white"
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
