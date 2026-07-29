# Starlite Tools Digital Showroom

A responsive industrial product catalogue and quote-request experience for Starlite Tools Company Limited. The site helps contractors, technicians, dealers, and bulk buyers explore the catalogue, compare products, assemble a quote list, and send a structured enquiry to the Starlite sales team through WhatsApp.

## Current experience

- Industrial Starlite/INGCO visual system with a responsive dual-brand hero
- 193 statically generated product-detail pages
- Product search, category and brand filters, availability filters, sorting, and comparison
- Persistent quote list and structured WhatsApp quote submission
- Local quote-history dashboard for dealer follow-up
- Responsive home, catalogue, product, quote, dealer, about, and contact experiences
- Original generated category and reference visuals with transparent backgrounds

Generated product renders are presentation/reference visuals, not official model photography. Exact product appearance should be confirmed before publishing a final commercial catalogue.

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
```

## Catalogue and quote data

Catalogue records currently live in `lib/ingco-catalogue.ts` and `lib/data.ts`. Quote selections and submitted quote history are stored locally in the browser; submitting a quote opens WhatsApp with a prepared sales message.
