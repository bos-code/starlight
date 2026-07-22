"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Download,
  Headset,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { getStoredQuotes, type QuoteStatus, type StoredQuote } from "@/lib/quote-log";
import { businessSettings } from "@/config/business";

const statusStyles: Record<QuoteStatus, string> = {
  New: "bg-brand-orange/15 text-brand-orange ring-brand-orange/30",
  Contacted: "bg-brand-steel/15 text-brand-steel ring-brand-steel/30",
  Quoted: "bg-brand-amber/15 text-brand-amber ring-brand-amber/30",
  Negotiating: "bg-brand-amber/15 text-brand-amber ring-brand-amber/30",
  "Waiting Payment": "bg-brand-amber/15 text-brand-amber ring-brand-amber/30",
  Paid: "bg-brand-green/15 text-brand-green ring-brand-green/30",
  Fulfilled: "bg-brand-green/15 text-brand-green ring-brand-green/30",
  Cancelled: "bg-brand-red/15 text-brand-red ring-brand-red/30",
};

const inProgressStatuses: QuoteStatus[] = ["Contacted", "Quoted", "Negotiating", "Waiting Payment"];

const sidebarLinks = [
  { label: "Dashboard", href: "/dealer", icon: LayoutDashboard, active: true },
  { label: "Quote List", href: "/quote", icon: ClipboardList },
  { label: "Product Catalogue", href: "/products", icon: Package },
  { label: "Contact Support", href: `https://wa.me/${businessSettings.whatsappNumber}`, icon: Headset, external: true },
];

export function DealerDashboard() {
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);

  useEffect(() => {
    setQuotes(getStoredQuotes());
  }, []);

  const stats = [
    { label: "Total Requests", value: quotes.length },
    { label: "New", value: quotes.filter((q) => q.status === "New").length },
    {
      label: "In Progress",
      value: quotes.filter((q) => inProgressStatuses.includes(q.status)).length,
    },
    { label: "Fulfilled", value: quotes.filter((q) => q.status === "Fulfilled").length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
          Dealer Portal
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold uppercase text-brand-white">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-brand-steel">
          {businessSettings.legalName} — quote activity submitted from this device.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit space-y-1 rounded-xl border border-brand-border bg-brand-surface p-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const className = `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              link.active
                ? "bg-brand-orange/10 text-brand-orange"
                : "text-brand-steel hover:bg-brand-graphite hover:text-brand-white"
            }`;
            return link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                <Icon className="h-4 w-4" />
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={className}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </aside>

        <div>
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-brand-border bg-brand-surface p-5"
              >
                <p className="font-heading text-3xl font-extrabold text-brand-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-brand-steel-dim">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/products"
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-4 transition hover:border-brand-orange/50"
            >
              <Package className="h-5 w-5 text-brand-orange" />
              <div>
                <p className="text-sm font-semibold text-brand-white">Start a New Quote</p>
                <p className="text-xs text-brand-steel-dim">Browse the catalogue and add items</p>
              </div>
            </Link>
            <a
              href={`https://wa.me/${businessSettings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-4 transition hover:border-brand-orange/50"
            >
              <Download className="h-5 w-5 text-brand-orange" />
              <div>
                <p className="text-sm font-semibold text-brand-white">Request Full Catalogue</p>
                <p className="text-xs text-brand-steel-dim">Ask our sales team on WhatsApp</p>
              </div>
            </a>
          </div>

          <div className="rounded-xl border border-brand-border bg-brand-surface">
            <div className="border-b border-brand-border px-5 py-4">
              <h2 className="font-heading text-lg font-bold uppercase text-brand-white">
                Recent Activity
              </h2>
            </div>

            {quotes.length === 0 ? (
              <div className="px-5 py-16 text-center text-sm text-brand-steel">
                No quote requests submitted from this device yet.{" "}
                <Link href="/products" className="text-brand-orange hover:underline">
                  Build your first quote
                </Link>
                .
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-border text-xs uppercase tracking-wide text-brand-steel-dim">
                      <th className="px-5 py-3 font-medium">Ref No.</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Items</th>
                      <th className="px-5 py-3 font-medium">Buyer Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="border-b border-brand-border last:border-0">
                        <td className="font-mono-meta px-5 py-3.5 font-medium text-brand-white">
                          {quote.reference}
                        </td>
                        <td className="px-5 py-3.5 text-brand-steel">
                          {new Date(quote.createdAt).toLocaleDateString("en-NG", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${statusStyles[quote.status]}`}
                          >
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-brand-steel">
                          {quote.items.reduce((sum, i) => sum + i.quantity, 0)} pcs
                        </td>
                        <td className="px-5 py-3.5 text-brand-steel">{quote.buyer.buyerType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
