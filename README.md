# Starlite Tools Digital Showroom

A responsive industrial product catalogue and quote-request experience for Starlite Tools Company Limited. The site helps contractors, technicians, dealers, and bulk buyers explore the catalogue, compare products, assemble a quote list, and send a structured enquiry to the Starlite sales team through WhatsApp.

## Current experience

- Industrial Starlite/INGCO visual system with a responsive dual-brand hero
- 193 statically generated product-detail pages
- Product search, category and brand filters, availability filters, sorting, comparison, and 12-item pagination
- Focused homepage journey that keeps the complete range inside the catalogue
- Persistent quote list with a request-received confirmation and optional WhatsApp handoff
- Local quote-history dashboard for dealer follow-up
- Branded Onitsha location panel with an external directions handoff
- Responsive home, catalogue, product, quote, dealer, about, and contact experiences
- Exact-SKU INGCO catalogue image links with generated transparent fallbacks

External product photographs are temporary pitch-stage references. Exact product
appearance and image-use approval should be confirmed before publishing a final
commercial catalogue. The project-only image disclaimer and takedown process are
documented in [`docs/IMAGE_USE_AND_ATTRIBUTION.md`](docs/IMAGE_USE_AND_ATTRIBUTION.md).

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide icons

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The production build statically generates the catalogue and all product routes.

## Project structure

```text
app/                    Routes and page composition
components/             Shared UI, catalogue, quote, and dealer components
components/home/        Homepage hero and supporting sections
lib/                    Catalogue data, quote state, WhatsApp helpers, and image mapping
public/images/tools/    Generated transparent tool visuals
scripts/                Repeatable product-image source refresh
```

## Catalogue and quote data

Catalogue records currently live in `lib/ingco-catalogue.ts` and `lib/data.ts`. Quote selections and submitted quote history are stored locally in the browser. The pitch flow acknowledges the request first, then lets the buyer send a prepared copy through WhatsApp.

Exact INGCO image links, source pages, and locally staged pitch assets live in
`lib/product-image-links.generated.json`. Refresh them from the public catalogue
with `npm run images:refresh`. Local generated cutouts remain available when an
external image is removed, blocked, or temporarily unavailable.

## Pitch-stage scope

This version demonstrates product discovery, enquiry collection, acknowledgement, and sales follow-up. It does not process online payments. Pricing, availability, delivery, and payment are intentionally left for the Starlite sales team to confirm after the enquiry.
