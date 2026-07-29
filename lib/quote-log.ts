"use client";

import type { QuoteBuyerDetails } from "./whatsapp";

export type QuoteStatus =
  | "New"
  | "Contacted"
  | "Quoted"
  | "Negotiating"
  | "Waiting Payment"
  | "Paid"
  | "Fulfilled"
  | "Cancelled";

export interface StoredQuoteItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface StoredQuote {
  id: string;
  reference: string;
  createdAt: string;
  buyer: QuoteBuyerDetails;
  items: StoredQuoteItem[];
  status: QuoteStatus;
}

const STORAGE_KEY = "starlite-quote-log";

export function getStoredQuotes(): StoredQuote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredQuote[]) : [];
  } catch {
    return [];
  }
}

export function addStoredQuote(quote: Omit<StoredQuote, "id" | "reference" | "createdAt" | "status">): StoredQuote {
  const existing = getStoredQuotes();
  const now = new Date();
  const reference = `QF-${now.getFullYear()}-${String(existing.length + 1).padStart(5, "0")}`;
  const record: StoredQuote = {
    id: crypto.randomUUID(),
    reference,
    createdAt: now.toISOString(),
    status: "New",
    ...quote,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing]));
  return record;
}
