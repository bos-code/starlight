import { businessSettings } from "./data";
import type { BuyerType, Product, QuoteLineItem } from "./types";

export interface QuoteBuyerDetails {
  fullName: string;
  companyName?: string;
  phone: string;
  email?: string;
  buyerType: BuyerType;
  location: string;
  deliveryLocation?: string;
  requiredDate?: string;
  notes?: string;
}

export function buildWhatsAppMessage(
  items: { product: Product; quantity: number }[],
  buyer: QuoteBuyerDetails
): string {
  const lines: string[] = [];
  lines.push(`Good day ${businessSettings.businessName}, I want to request a quote for the following items:`);
  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.product.name} - Qty: ${item.quantity}`);
  });
  lines.push("");
  lines.push(`Name: ${buyer.fullName}`);
  if (buyer.companyName) lines.push(`Company: ${buyer.companyName}`);
  lines.push(`Phone: ${buyer.phone}`);
  if (buyer.email) lines.push(`Email: ${buyer.email}`);
  lines.push(`Location: ${buyer.location}`);
  lines.push(`Buyer Type: ${buyer.buyerType}`);
  if (buyer.deliveryLocation) lines.push(`Delivery Location: ${buyer.deliveryLocation}`);
  if (buyer.requiredDate) lines.push(`Required Date: ${buyer.requiredDate}`);
  if (buyer.notes) lines.push(`Note: ${buyer.notes}`);
  lines.push("");
  lines.push("Please confirm price, availability, and delivery options.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${businessSettings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function quoteItemsToLines(
  items: QuoteLineItem[],
  getProduct: (id: string) => Product | undefined
): { product: Product; quantity: number }[] {
  return items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity };
    })
    .filter((v): v is { product: Product; quantity: number } => v !== null);
}
