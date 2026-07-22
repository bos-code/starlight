import { ingcoCategories, ingcoProducts } from "./ingco-catalogue";
import type { Brand, Category, Industry, Product } from "./types";

export const categories: Category[] = ingcoCategories;

export const industries: Industry[] = [
  { id: "ind-construction", name: "Construction", slug: "construction", description: "Site-grade tools for builders and contractors." },
  { id: "ind-welding", name: "Welding & Fabrication", slug: "welding-fabrication", description: "Welding machines, rods and fabrication accessories." },
  { id: "ind-carpentry", name: "Carpentry & Woodworking", slug: "carpentry-woodworking", description: "Saws, routers and precision woodworking tools." },
  { id: "ind-electrical", name: "Electrical Installation", slug: "electrical-installation", description: "Tools and testers for electrical installation work." },
];

export const brands: Brand[] = [
  { id: "brand-ingco", name: "INGCO", slug: "ingco", description: "INGCO power tools, hand tools, generators and industrial equipment — catalogue data confirmed from ingco.com." },
  { id: "brand-total", name: "TOTAL", slug: "total", description: "TOTAL Tools — durable equipment for trade and industry." },
  { id: "brand-bosch", name: "BOSCH", slug: "bosch", description: "Bosch professional power tools." },
  { id: "brand-makita", name: "MAKITA", slug: "makita", description: "Makita cordless and corded professional tools." },
  { id: "brand-dewalt", name: "DEWALT", slug: "dewalt", description: "DeWalt heavy-duty jobsite tools." },
];

/**
 * Non-INGCO catalogue entries. Starlite is a multi-brand supplier, but the confirmed
 * dataset (ingco-catalogue.ts) only covers INGCO. These illustrate catalogue breadth
 * across other brands Starlite carries — mark clearly if brand mix changes.
 */
const otherBrandProducts: Product[] = [
  {
    id: "p-hammer-drill-corded",
    name: "TOTAL Corded Hammer Drill",
    slug: "total-corded-hammer-drill",
    sku: "TG1131266",
    model: "TG1131266",
    brandId: "brand-total",
    categoryId: "cat-power-tools",
    industryIds: ["ind-construction", "ind-electrical"],
    shortDescription: "1300W corded hammer drill for heavy masonry and concrete drilling.",
    description:
      "A mains-powered hammer drill built for continuous, heavy-duty masonry drilling on commercial sites where cordless runtime is not practical.",
    specs: [
      { label: "Power", value: "1300 W" },
      { label: "Chuck", value: "13 mm Keyed" },
      { label: "No-load Speed", value: "0-3,000 RPM" },
      { label: "Impact Rate", value: "0-48,000 BPM" },
      { label: "Weight", value: "3.2 KG" },
    ],
    included: ["1x Drill body", "1x Side handle", "1x Depth gauge"],
    availabilityStatus: "price_on_request",
    isFeatured: false,
    voltage: null,
    productType: "Hammer Drill",
    powerSource: "Corded / Mains",
  },
  {
    id: "p-angle-grinder-bosch",
    name: "BOSCH Professional Angle Grinder",
    slug: "bosch-professional-angle-grinder",
    sku: "GWS-750-100",
    model: "GWS 750-100",
    brandId: "brand-bosch",
    categoryId: "cat-power-tools",
    industryIds: ["ind-construction", "ind-welding"],
    shortDescription: "750W corded angle grinder for continuous cutting and grinding.",
    description:
      "Bosch Professional corded angle grinder built for reliable, all-day cutting and grinding in fabrication shops and on construction sites.",
    specs: [
      { label: "Power", value: "750 W" },
      { label: "Disc Diameter", value: "100 mm" },
      { label: "No-load Speed", value: "12,000 RPM" },
      { label: "Weight", value: "1.8 KG" },
    ],
    included: ["1x Grinder body", "1x Guard", "1x Auxiliary handle"],
    availabilityStatus: "price_on_request",
    isFeatured: false,
    voltage: null,
    productType: "Angle Grinder",
    powerSource: "Corded / Mains",
  },
  {
    id: "p-screwdriver-makita",
    name: "MAKITA Cordless Screwdriver",
    slug: "makita-cordless-screwdriver",
    sku: "DF012DSE",
    model: "DF012DSE",
    brandId: "brand-makita",
    categoryId: "cat-cordless-tools",
    industryIds: ["ind-carpentry", "ind-electrical"],
    shortDescription: "Compact cordless screwdriver for panel assembly and fixture work.",
    description:
      "A compact, lightweight cordless screwdriver suited to panel building, fixture installation and light assembly work where a full drill is unnecessary.",
    specs: [
      { label: "Voltage", value: "7.2V" },
      { label: "Chuck", value: "1/4\" Hex" },
      { label: "No-load Speed", value: "0-200 / 0-650 RPM" },
      { label: "Weight", value: "0.6 KG" },
    ],
    included: ["1x Driver body", "1x Battery", "1x Charger", "1x Case"],
    availabilityStatus: "price_on_request",
    isFeatured: false,
    voltage: "7.2V",
    productType: "Cordless Screwdriver",
    powerSource: "Cordless (Battery)",
  },
  {
    id: "p-demolition-hammer-dewalt",
    name: "DEWALT Demolition Hammer",
    slug: "dewalt-demolition-hammer",
    sku: "D25899K",
    model: "D25899K",
    brandId: "brand-dewalt",
    categoryId: "cat-power-tools",
    industryIds: ["ind-construction"],
    shortDescription: "Heavy-duty SDS-Max demolition hammer for concrete breaking.",
    description:
      "A heavy-duty demolition hammer for breaking concrete, chasing walls and general jobsite demolition. Built for daily commercial use.",
    specs: [
      { label: "Power", value: "1600 W" },
      { label: "Chuck", value: "SDS-Max" },
      { label: "Impact Energy", value: "17.5 J" },
      { label: "Weight", value: "11.6 KG" },
    ],
    included: ["1x Hammer body", "1x Chisel", "1x Point", "1x Case"],
    availabilityStatus: "price_on_request",
    isFeatured: false,
    voltage: null,
    productType: "Demolition Hammer",
    powerSource: "Corded / Mains",
  },
  {
    id: "p-generator-total",
    name: "TOTAL Petrol Generator 5.5KVA",
    slug: "total-petrol-generator-5-5kva",
    sku: "TP1550001",
    model: "TP1550001",
    brandId: "brand-total",
    categoryId: "cat-generators",
    industryIds: ["ind-construction"],
    shortDescription: "5.5KVA petrol generator for site power and backup supply.",
    description:
      "A 5.5KVA air-cooled petrol generator suited to powering site tools, small workshops, and backup supply for shops and offices.",
    specs: [
      { label: "Rated Output", value: "5.0 KVA" },
      { label: "Max Output", value: "5.5 KVA" },
      { label: "Fuel", value: "Petrol" },
      { label: "Tank Capacity", value: "15 L" },
      { label: "Weight", value: "45 KG" },
    ],
    included: ["1x Generator", "1x Tool kit", "1x Manual"],
    availabilityStatus: "price_on_request",
    isFeatured: false,
    voltage: null,
    productType: "Petrol Generator",
    powerSource: "Petrol / Gasoline",
  },
];

export const products: Product[] = [...ingcoProducts, ...otherBrandProducts];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getBrand(brandId: string): Brand | undefined {
  return brands.find((b) => b.id === brandId);
}

export function getCategory(categoryId: string): Category | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}
