"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  CreditCard,
  Database,
  Headphones,
  Inbox,
  LockKeyhole,
  PackageCheck,
  RefreshCw,
  Send,
  ShieldCheck,
  Truck,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import {
  getStoredQuotes,
  updateStoredQuoteStatus,
  type QuoteStatus,
  type StoredQuote,
} from "@/lib/quote-log";
import { SectionMarker } from "@/components/brand/SectionMarker";

const statuses: QuoteStatus[] = [
  "New",
  "Contacted",
  "Quoted",
  "Negotiating",
  "Waiting Payment",
  "Paid",
  "Fulfilled",
  "Cancelled",
];

const statusStyles: Record<QuoteStatus, string> = {
  New: "border-brand-orange/40 bg-brand-orange/10 text-brand-orange",
  Contacted: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  Quoted: "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  Negotiating: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  "Waiting Payment": "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  Paid: "border-brand-green/40 bg-brand-green/10 text-brand-green",
  Fulfilled: "border-brand-green/40 bg-brand-green/10 text-brand-green",
  Cancelled: "border-brand-red/40 bg-brand-red/10 text-brand-red",
};

const operatingAdvantages = [
  {
    icon: Inbox,
    title: "One enquiry inbox",
    description:
      "Product lists, buyer details and delivery locations arrive as structured records instead of scattered screenshots.",
  },
  {
    icon: UserRoundCheck,
    title: "Follow-up ownership",
    description:
      "A shared pipeline can show who is handling each request, its next action and how long it has been waiting.",
  },
  {
    icon: BarChart3,
    title: "Demand intelligence",
    description:
      "Repeated searches and quote requests reveal the products, categories and locations buyers are asking for.",
  },
  {
    icon: UsersRound,
    title: "Buyer relationships",
    description:
      "Retail, dealer, contractor and wholesale requests can follow different pricing and service paths.",
  },
];

const roadmapRows = [
  {
    area: "Catalogue",
    icon: Database,
    now: "Searchable product records with specifications and quote-list actions.",
    next: "Multi-brand catalogue management, bulk import and branch-level availability.",
  },
  {
    area: "Sales",
    icon: Workflow,
    now: "Structured requests, reference numbers, WhatsApp handoff and status tracking.",
    next: "Shared staff inbox, ownership, reminders, approvals and customer history.",
  },
  {
    area: "Stock",
    icon: Boxes,
    now: "Availability is confirmed manually by the sales team.",
    next: "Inventory visibility, reservations, low-stock alerts and supplier replenishment.",
  },
  {
    area: "Payment",
    icon: CreditCard,
    now: "Payment stays outside V1 and follows an approved sales quote.",
    next: "Secure payment links, bank-transfer matching, receipts and reconciliation.",
  },
  {
    area: "Delivery",
    icon: Truck,
    now: "Pickup or delivery is agreed directly with the buyer.",
    next: "Dispatch assignment, delivery milestones and buyer notifications.",
  },
  {
    area: "After-sales",
    icon: Headphones,
    now: "Support continues through the sales and WhatsApp relationship.",
    next: "Tool registration, warranty, repair history, parts and one-click reorder.",
  },
];

type BusinessDeskProps = {
  productCount: number;
  categoryCount: number;
  brandCount: number;
};

type QuoteSnapshot = {
  hydrated: boolean;
  quotes: StoredQuote[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function BusinessDesk({
  productCount,
  categoryCount,
  brandCount,
}: BusinessDeskProps) {
  const [snapshot, setSnapshot] = useState<QuoteSnapshot>({
    hydrated: false,
    quotes: [],
  });

  useEffect(() => {
    // localStorage is the intentionally lightweight V1 data layer for this pitch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot({ hydrated: true, quotes: getStoredQuotes() });
  }, []);

  const totalUnits = useMemo(
    () =>
      snapshot.quotes.reduce(
        (quoteTotal, quote) =>
          quoteTotal +
          quote.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
        0
      ),
    [snapshot.quotes]
  );

  const newRequests = snapshot.quotes.filter((quote) => quote.status === "New").length;

  function changeStatus(quoteId: string, status: QuoteStatus) {
    setSnapshot({
      hydrated: true,
      quotes: updateStoredQuoteStatus(quoteId, status),
    });
  }

  const stats = [
    {
      label: "Catalogue records",
      value: productCount,
      detail: `${categoryCount} categories / ${brandCount} brands`,
      icon: Database,
    },
    {
      label: "Requests captured",
      value: snapshot.hydrated ? snapshot.quotes.length : "—",
      detail: "Submitted from this device",
      icon: Inbox,
    },
    {
      label: "New follow-ups",
      value: snapshot.hydrated ? newRequests : "—",
      detail: "Awaiting first sales action",
      icon: CircleDot,
    },
    {
      label: "Units requested",
      value: snapshot.hydrated ? totalUnits : "—",
      detail: "Across recorded enquiries",
      icon: PackageCheck,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-border bg-brand-navy">
        <div className="technical-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 border border-brand-orange/40 bg-brand-orange/10 px-3 py-1.5 font-mono-meta text-[9px] uppercase tracking-[0.16em] text-brand-orange">
                <LockKeyhole className="h-3.5 w-3.5" />
                V1 Operations Preview
              </span>
              <span className="font-mono-meta text-[9px] uppercase tracking-[0.14em] text-brand-steel-dim">
                Local demo data / no staff login
              </span>
            </div>
            <SectionMarker index="Business / 01" label="The Other Side Of The Storefront" />
            <h1 className="mt-4 max-w-3xl font-heading text-5xl font-extrabold uppercase leading-[0.9] text-brand-white sm:text-6xl lg:text-7xl">
              Every enquiry
              <br />
              becomes a
              <br />
              <span className="text-brand-orange">business record.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-steel">
              The catalogue helps buyers find tools. The Business Desk helps Starlite
              receive, organise and follow up each request — creating a practical bridge
              between the market relationship and a full digital trade operation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
              >
                Create a Test Request
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#full-product"
                className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface/70 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-brand-orange"
              >
                See the Full-Product Path
              </a>
            </div>
          </div>

          <div className="border border-brand-border bg-brand-graphite/90 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-brand-border px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-brand-green shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="font-mono-meta text-[9px] uppercase tracking-[0.16em] text-brand-steel">
                  STL / Sales Continuity Loop
                </span>
              </div>
              <span className="font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-orange">
                V1 Proof
              </span>
            </div>
            <div className="p-5 sm:p-7">
              {[
                {
                  index: "01",
                  title: "Buyer finds the right SKU",
                  detail: "Search, specifications and product shortlist",
                  icon: Database,
                  state: "Live",
                },
                {
                  index: "02",
                  title: "Request arrives with context",
                  detail: "Buyer type, quantities, location and notes",
                  icon: Send,
                  state: "Live",
                },
                {
                  index: "03",
                  title: "Sales follows one pipeline",
                  detail: "Reference, status and next follow-up",
                  icon: ClipboardCheck,
                  state: "Live",
                },
                {
                  index: "04",
                  title: "Operations connect around it",
                  detail: "Stock, payment, delivery and after-sales",
                  icon: Building2,
                  state: "Next",
                },
              ].map(({ index, title, detail, icon: Icon, state }, itemIndex, list) => (
                <div key={index} className="relative grid grid-cols-[2.75rem_1fr_auto] gap-3">
                  {itemIndex < list.length - 1 && (
                    <span className="absolute bottom-0 left-[1.35rem] top-11 w-px bg-brand-border" />
                  )}
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center border border-brand-border bg-brand-surface">
                    <Icon className="h-5 w-5 text-brand-orange" strokeWidth={1.5} />
                  </span>
                  <div className="pb-7">
                    <p className="font-heading text-lg font-bold uppercase leading-tight text-brand-white">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-steel-dim">{detail}</p>
                  </div>
                  <span
                    className={`mt-1 h-fit border px-2 py-1 font-mono-meta text-[8px] uppercase tracking-[0.12em] ${
                      state === "Live"
                        ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
                        : "border-brand-border bg-brand-surface text-brand-steel-dim"
                    }`}
                  >
                    {state}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-px border-t border-brand-border bg-brand-border">
              {[
                [String(productCount), "Product records"],
                [String(categoryCount), "Categories"],
                ["01", "Connected loop"],
              ].map(([value, label]) => (
                <div key={label} className="bg-brand-surface px-4 py-4">
                  <p className="font-heading text-2xl font-extrabold text-brand-white">{value}</p>
                  <p className="font-mono-meta text-[8px] uppercase tracking-[0.12em] text-brand-steel-dim">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SectionMarker index="Business / 02" label="Live V1 Signal" />
              <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase text-brand-white sm:text-4xl">
                What the business can see now
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-brand-steel">
              These figures use the catalogue and quote activity in this browser. They are
              not invented company performance numbers.
            </p>
          </div>

          <div className="grid gap-px border border-brand-border bg-brand-border sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, detail, icon: Icon }) => (
              <article key={label} className="bg-brand-surface p-5">
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-brand-orange" strokeWidth={1.5} />
                  <span className="font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-steel-dim">
                    Live / V1
                  </span>
                </div>
                <p className="mt-8 font-heading text-4xl font-extrabold text-brand-white">{value}</p>
                <p className="mt-1 font-heading text-sm font-bold uppercase text-brand-white">
                  {label}
                </p>
                <p className="mt-1 text-xs text-brand-steel-dim">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-brand-border bg-brand-graphite">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 xl:grid-cols-[1fr_330px]">
          <div className="min-w-0 border border-brand-border bg-brand-surface">
            <div className="flex flex-col justify-between gap-3 border-b border-brand-border px-5 py-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono-meta text-[9px] uppercase tracking-[0.15em] text-brand-orange">
                  Enquiry Inbox
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold uppercase text-brand-white">
                  Requests captured on this device
                </h2>
              </div>
              <span className="inline-flex w-fit items-center gap-2 border border-brand-border bg-brand-graphite px-2.5 py-1.5 font-mono-meta text-[8px] uppercase tracking-[0.12em] text-brand-steel-dim">
                <RefreshCw className="h-3 w-3" />
                Refresh page after a test submission
              </span>
            </div>

            {!snapshot.hydrated ? (
              <div className="px-5 py-20 text-center text-sm text-brand-steel">
                Loading local V1 requests…
              </div>
            ) : snapshot.quotes.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center border border-brand-border bg-brand-graphite">
                  <Inbox className="h-5 w-5 text-brand-orange" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold uppercase text-brand-white">
                  No requests recorded yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-steel">
                  Add products to a quote list and submit the buyer form. The request will
                  appear here as proof of the V1 handoff.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 bg-brand-orange px-5 py-3 text-xs font-bold uppercase tracking-wide text-brand-graphite"
                >
                  Build a Test Request
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead>
                    <tr className="border-b border-brand-border font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-steel-dim">
                      <th className="px-5 py-3 font-medium">Reference</th>
                      <th className="px-5 py-3 font-medium">Buyer</th>
                      <th className="px-5 py-3 font-medium">Request</th>
                      <th className="px-5 py-3 font-medium">Location</th>
                      <th className="px-5 py-3 font-medium">Submitted</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snapshot.quotes.map((quote) => {
                      const unitCount = quote.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );
                      return (
                        <tr
                          key={quote.id}
                          className="border-b border-brand-border text-sm last:border-b-0 hover:bg-brand-graphite/45"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono-meta text-[11px] font-semibold text-brand-orange">
                              {quote.reference}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-brand-white">{quote.buyer.fullName}</p>
                            <p className="mt-0.5 text-xs text-brand-steel-dim">
                              {quote.buyer.companyName || quote.buyer.buyerType}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-brand-white">
                              {unitCount} unit{unitCount === 1 ? "" : "s"}
                            </p>
                            <p className="mt-0.5 max-w-52 truncate text-xs text-brand-steel-dim">
                              {quote.items.map((item) => item.productName).join(", ")}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-brand-steel">{quote.buyer.location}</td>
                          <td className="px-5 py-4 text-brand-steel">
                            {formatDate(quote.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <select
                              aria-label={`Status for ${quote.reference}`}
                              value={quote.status}
                              onChange={(event) =>
                                changeStatus(quote.id, event.target.value as QuoteStatus)
                              }
                              className={`min-w-36 border px-2.5 py-2 text-xs font-semibold uppercase outline-none ${statusStyles[quote.status]}`}
                            >
                              {statuses.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-brand-graphite text-brand-white"
                                >
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="h-fit border border-brand-border bg-brand-surface">
            <div className="border-b border-brand-border px-5 py-4">
              <p className="font-mono-meta text-[9px] uppercase tracking-[0.15em] text-brand-orange">
                Demo Loop
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold uppercase text-brand-white">
                What this V1 proves
              </h2>
            </div>
            <div className="p-5">
              {[
                ["01", "Select real catalogue products"],
                ["02", "Submit buyer and delivery details"],
                ["03", "Receive a tracked reference"],
                ["04", "Open the request in this desk"],
                ["05", "Move it through a sales status"],
              ].map(([index, label]) => (
                <div
                  key={index}
                  className="flex gap-3 border-b border-brand-border py-3.5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono-meta text-[9px] text-brand-orange">{index}</span>
                  <p className="text-sm text-brand-steel">{label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-border bg-brand-navy/40 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                <p className="text-xs leading-relaxed text-brand-steel-dim">
                  Production replaces browser storage with secure accounts, permissions,
                  audit logs, backups and a shared database.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="technical-grid border-b border-brand-border bg-brand-navy">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 max-w-3xl">
            <SectionMarker index="Business / 03" label="Why It Matters" />
            <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-none text-brand-white">
              A stronger online presence.
              <br />
              <span className="text-brand-orange">A stronger operating system.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-brand-steel">
              The platform earns its place by helping both sides of the transaction:
              buyers get clarity and the team gets continuity, visibility and better
              information for decisions.
            </p>
          </div>
          <div className="grid gap-px border border-brand-border bg-brand-border sm:grid-cols-2 xl:grid-cols-4">
            {operatingAdvantages.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="relative min-h-64 bg-brand-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center border border-brand-orange/40 bg-brand-graphite">
                    <Icon className="h-5 w-5 text-brand-orange" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-steel-dim">
                    Advantage / 0{index + 1}
                  </span>
                </div>
                <h3 className="mt-10 font-heading text-xl font-bold uppercase text-brand-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-steel">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="full-product" className="border-b border-brand-border bg-brand-graphite-light">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-9 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <SectionMarker index="Business / 04" label="V1 To Full Product" />
              <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-none text-brand-white">
                What works tonight.
                <br />
                <span className="text-brand-orange">What the next phase unlocks.</span>
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-brand-steel">
              V1 proves the buying and enquiry loop. The full product turns that loop into
              a secure, multi-user system connected to how the business sells, stocks,
              delivers and supports tools.
            </p>
          </div>

          <div className="overflow-hidden border border-brand-border">
            <div className="hidden grid-cols-[180px_1fr_1fr] gap-px bg-brand-border md:grid">
              <div className="bg-brand-graphite px-5 py-3 font-mono-meta text-[9px] uppercase tracking-[0.15em] text-brand-steel-dim">
                Operation
              </div>
              <div className="bg-brand-graphite px-5 py-3 font-mono-meta text-[9px] uppercase tracking-[0.15em] text-brand-green">
                V1 / Working Now
              </div>
              <div className="bg-brand-graphite px-5 py-3 font-mono-meta text-[9px] uppercase tracking-[0.15em] text-brand-orange">
                Full Product / Proposed
              </div>
            </div>
            <div className="divide-y divide-brand-border">
              {roadmapRows.map(({ area, icon: Icon, now, next }) => (
                <div
                  key={area}
                  className="grid gap-px bg-brand-border md:grid-cols-[180px_1fr_1fr]"
                >
                  <div className="flex items-center gap-3 bg-brand-surface px-5 py-5">
                    <Icon className="h-5 w-5 shrink-0 text-brand-orange" strokeWidth={1.5} />
                    <p className="font-heading text-base font-bold uppercase text-brand-white">
                      {area}
                    </p>
                  </div>
                  <div className="bg-brand-surface px-5 py-5">
                    <p className="mb-2 font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-green md:hidden">
                      V1 / Working Now
                    </p>
                    <p className="flex gap-2 text-sm leading-relaxed text-brand-steel">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      {now}
                    </p>
                  </div>
                  <div className="bg-brand-surface-raised px-5 py-5">
                    <p className="mb-2 font-mono-meta text-[8px] uppercase tracking-[0.14em] text-brand-orange md:hidden">
                      Full Product / Proposed
                    </p>
                    <p className="flex gap-2 text-sm leading-relaxed text-brand-steel">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                      {next}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-px border border-brand-border bg-brand-border lg:grid-cols-[1fr_auto]">
            <div className="bg-brand-surface p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-orange" />
                <div>
                  <h3 className="font-heading text-xl font-bold uppercase text-brand-white">
                    The pitch in one sentence
                  </h3>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-brand-steel">
                    Starlite&apos;s offline strength becomes a digital front door for
                    customers and a connected trade desk for the team — starting with
                    product discovery and enquiries, then growing into stock, payment,
                    fulfilment and after-sales.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/quote"
              className="flex items-center justify-center gap-2 bg-brand-orange px-8 py-5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110 lg:min-w-60"
            >
              Test the Request Flow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
