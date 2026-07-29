"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, Minus, Plus, Trash2 } from "lucide-react";
import { useQuote } from "@/lib/quote-context";
import { getBrand, getCategory } from "@/lib/data";
import { ProductVisual } from "./ProductVisual";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SectionMarker } from "./brand/SectionMarker";
import { buildWhatsAppMessage, buildWhatsAppUrl, type QuoteBuyerDetails } from "@/lib/whatsapp";
import { addStoredQuote } from "@/lib/quote-log";
import type { BuyerType } from "@/lib/types";

const buyerTypes: BuyerType[] = ["Retail Customer", "Contractor", "Dealer", "Wholesale Buyer"];

type FormState = Omit<QuoteBuyerDetails, "buyerType"> & { buyerType: BuyerType | "" };
type Confirmation = { reference: string; whatsappUrl: string };

const emptyForm: FormState = {
  fullName: "",
  companyName: "",
  phone: "",
  email: "",
  buyerType: "",
  location: "",
  requiredDate: "",
  notes: "",
};

export function QuoteBuilder() {
  const { items, itemCount, removeItem, updateQuantity, clear, getProduct } = useQuote();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const lineItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProduct(item.productId);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((v): v is { product: NonNullable<ReturnType<typeof getProduct>>; quantity: number } => v !== null),
    [items, getProduct]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone / WhatsApp number is required.";
    if (!form.buyerType) next.buyerType = "Select a buyer type.";
    if (!form.location.trim()) next.location = "Delivery location is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lineItems.length === 0) return;
    if (!validate()) return;

    const buyer: QuoteBuyerDetails = { ...form, buyerType: form.buyerType as BuyerType };
    const message = buildWhatsAppMessage(lineItems, buyer);
    const url = buildWhatsAppUrl(message);

    const record = addStoredQuote({
      buyer,
      items: lineItems.map((li) => ({
        productId: li.product.id,
        productName: li.product.name,
        quantity: li.quantity,
      })),
    });

    setConfirmation({ reference: record.reference, whatsappUrl: url });
    clear();
    setForm(emptyForm);
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="relative overflow-hidden border border-brand-border bg-brand-surface">
          <div className="technical-grid pointer-events-none absolute inset-0 opacity-45" />
          <div className="relative grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="border-b border-brand-border p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <SectionMarker index="Request / Complete" label="Enquiry Received" />
              <span className="mt-10 flex h-16 w-16 items-center justify-center border border-emerald-400/50 bg-emerald-400/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </span>
              <h1 className="mt-7 max-w-2xl font-heading text-4xl font-extrabold uppercase leading-[0.96] text-brand-white sm:text-5xl">
                Thank you.
                <br />
                <span className="text-brand-orange">We received your request.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-steel">
                Reference{" "}
                <span className="font-mono-meta font-semibold text-brand-white">
                  {confirmation.reference}
                </span>{" "}
                has been recorded. The sales team will review the products and continue
                the conversation with pricing and availability.
              </p>
            </div>

            <div className="flex flex-col justify-between bg-brand-graphite/80 p-8 sm:p-10">
              <div>
                <p className="font-mono-meta text-[9px] uppercase tracking-[0.16em] text-brand-orange">
                  What happens next
                </p>
                <div className="mt-5 divide-y divide-brand-border border-y border-brand-border">
                  {[
                    ["01", "Request received", "Your selected products and contact details are recorded."],
                    ["02", "Sales review", "Starlite confirms stock, pricing and delivery details."],
                    ["03", "WhatsApp follow-up", "The conversation continues directly with the buyer."],
                  ].map(([index, title, description]) => (
                    <div key={index} className="grid grid-cols-[2.5rem_1fr] gap-3 py-4">
                      <span className="font-mono-meta text-[10px] text-brand-orange">{index}</span>
                      <div>
                        <p className="font-heading text-base font-bold uppercase text-brand-white">
                          {title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-brand-steel-dim">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-brand-steel-dim">
                  In the production phase, the buyer and sales team can receive automatic
                  WhatsApp or email confirmations at this point.
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 bg-brand-orange px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110"
                >
                  Back to Homepage
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={confirmation.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-brand-border bg-brand-surface px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-white transition hover:border-emerald-400 hover:text-emerald-400"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Send Copy on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
          Quote Builder
        </p>
        <h1 className="mt-1 font-heading text-3xl font-bold uppercase text-brand-white">
          Quote List
        </h1>
        <p className="mt-2 text-sm text-brand-steel">
          {itemCount} item{itemCount === 1 ? "" : "s"} selected. This pitch collects a
          structured enquiry only — pricing, availability and payment are confirmed later
          by the sales team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {lineItems.length === 0 ? (
            <div className="border border-dashed border-brand-border py-20 text-center text-brand-steel">
              Your quote list is empty.{" "}
              <Link href="/products" className="text-brand-orange hover:underline">
                Browse the catalogue
              </Link>{" "}
              to add products.
            </div>
          ) : (
            lineItems.map(({ product, quantity }) => {
              const brand = getBrand(product.brandId);
              const category = getCategory(product.categoryId);
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border border-brand-border bg-brand-surface p-4"
                >
                  <ProductVisual
                    product={product}
                    categorySlug={category?.slug ?? ""}
                    categoryName={category?.name}
                    className="h-20 w-20 shrink-0 border border-brand-border"
                    sizes="80px"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-orange">
                      {brand?.name}
                    </p>
                    <p className="truncate font-heading text-base font-semibold text-brand-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-steel-dim">Model {product.model}</p>
                  </div>
                  <div className="flex items-center border border-brand-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-brand-steel hover:text-brand-white"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm text-brand-white">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-brand-steel hover:text-brand-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => removeItem(product.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center border border-transparent text-brand-steel-dim hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="h-fit space-y-5 border border-brand-border bg-brand-surface p-6">
          <h2 className="font-heading text-lg font-bold uppercase text-brand-white">
            Buyer Information
          </h2>

          <Field label="Full Name" required error={errors.fullName}>
            <input
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="input"
              placeholder="Chidera Okonkwo"
            />
          </Field>

          <Field label="Company / Business Name">
            <input
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              className="input"
              placeholder="Optional"
            />
          </Field>

          <Field label="Phone / WhatsApp Number" required error={errors.phone}>
            <input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="input"
              placeholder="080..."
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input"
              placeholder="Optional"
            />
          </Field>

          <Field label="Buyer Type" required error={errors.buyerType}>
            <select
              value={form.buyerType}
              onChange={(e) => updateField("buyerType", e.target.value as BuyerType)}
              className="input"
            >
              <option value="">Select buyer type</option>
              {buyerTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Delivery Location" required error={errors.location}>
            <input
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="input"
              placeholder="City, State"
            />
          </Field>

          <Field label="Required Date (optional)">
            <input
              type="date"
              value={form.requiredDate}
              onChange={(e) => updateField("requiredDate", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Notes / Additional Requirements">
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Tell us more about your need..."
            />
          </Field>

          <button
            type="submit"
            disabled={lineItems.length === 0}
            className="flex w-full items-center justify-center gap-2 bg-brand-orange py-3.5 text-sm font-bold uppercase tracking-wide text-brand-graphite transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MessageSquareText className="h-4 w-4" />
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-brand-steel">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
