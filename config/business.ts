import type { BusinessSettings } from "@/lib/types";

/**
 * Central business configuration — contact details, hours and map coordinates.
 * Nothing in components should hardcode this data; import from here instead.
 */
export const businessSettings: BusinessSettings = {
  businessName: "Starlite Tools",
  legalName: "Starlite Tools Company Limited",
  tagline: "Tools built for work that cannot fail.",
  whatsappNumber: "2348031234567",
  whatsappDisplay: "+234 803 123 4567",
  phoneDisplay: "+234 806 765 4321",
  email: "sales@starlitetools.ng",
  address: "Ochanja Market, Onitsha",
  city: "Onitsha",
  state: "Anambra State",
  country: "Nigeria",
  hours: "Monday – Saturday, 8:00 AM – 6:00 PM",
  yearsInBusiness: "20+",
  productsSupplied: "1000+",
  dealerPartners: "500+",
  coverage: "Nigeria",
};

export interface BusinessCoordinates {
  lat: number;
  lng: number;
  /** False until the exact shop location is confirmed with the business owner. */
  confirmed: boolean;
  /** What this pin actually represents while unconfirmed. */
  note: string;
}

/**
 * TEMPORARY: general Onitsha city-centre coordinates, not the confirmed Ochanja
 * Market storefront location. Replace once the business confirms exact coordinates
 * (e.g. by dropping a pin in Google Maps and reading the lat/lng from the URL).
 */
export const businessCoordinates: BusinessCoordinates = {
  lat: 6.1489,
  lng: 6.7867,
  confirmed: false,
  note: "Approximate Onitsha city-centre location — pending confirmed coordinates for Ochanja Market.",
};

export function buildDirectionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${businessCoordinates.lat},${businessCoordinates.lng}`;
}

export function buildMapEmbedUrl(): string {
  const { lat, lng } = businessCoordinates;
  const delta = 0.01;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
