// app/api/products/route.ts
// Public product listing with validated filtering, sorting, and pagination.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublishedProducts } from '../../../packages/catalogue/products.dal';
import type { AvailabilityStatus, PriceVisibility } from '@prisma/client';

// ─── Input validation schema ──────────────────────────────────────────────────

const QuerySchema = z.object({
  search: z.string().max(200).optional(),
  brand: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  availability: z
    .enum(['AVAILABLE', 'CONFIRM_AVAILABILITY', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'])
    .optional(),
  priceVisibility: z
    .enum(['PUBLIC_PRICE', 'PRICE_ON_REQUEST', 'DEALER_PRICE_REQUEST', 'CONTACT_SALES'])
    .optional(),
  voltage: z.string().max(20).optional(),
  powerSource: z.string().max(50).optional(),
  productType: z.string().max(100).optional(),
  featured: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'sku']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

  // Parse and validate query parameters
  const rawParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(rawParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: { 'X-Request-Id': requestId } },
    );
  }

  const q = parsed.data;

  try {
    const result = await getPublishedProducts({
      search: q.search,
      brandSlug: q.brand,
      categorySlug: q.category,
      availability: q.availability as AvailabilityStatus | undefined,
      priceVisibility: q.priceVisibility as PriceVisibility | undefined,
      voltage: q.voltage,
      powerSource: q.powerSource,
      productType: q.productType,
      isFeatured: q.featured === 'true' ? true : q.featured === 'false' ? false : undefined,
      sortBy: q.sortBy,
      sortOrder: q.sortOrder,
      page: q.page,
      limit: q.limit,
    });

    return NextResponse.json(result, {
      headers: {
        'X-Request-Id': requestId,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (err) {
    console.error('[/api/products]', err);
    return NextResponse.json(
      { error: 'Unable to retrieve products at this time.' },
      { status: 500, headers: { 'X-Request-Id': requestId } },
    );
  }
}
