export type AvailabilityStatus = "in_stock" | "low_stock" | "out_of_stock" | "price_on_request";

export type BuyerType = "Retail Customer" | "Contractor" | "Dealer" | "Wholesale Buyer";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  model: string;
  brandId: string;
  categoryId: string;
  industryIds: string[];
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  included: string[];
  availabilityStatus: AvailabilityStatus;
  isFeatured: boolean;
  voltage: string | null;
}

export interface BusinessSettings {
  businessName: string;
  legalName: string;
  tagline: string;
  whatsappNumber: string; // digits only, international format, no plus
  whatsappDisplay: string;
  phoneDisplay: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  hours: string;
  yearsInBusiness: string;
  productsSupplied: string;
  dealerPartners: string;
  coverage: string;
}

export interface QuoteLineItem {
  productId: string;
  quantity: number;
  note?: string;
}
