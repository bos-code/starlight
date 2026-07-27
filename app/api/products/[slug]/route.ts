// app/api/products/[slug]/route.ts
// Single product detail endpoint. Public, read-only.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublishedProductBySlug } from '../../../../packages/catalogue/products.dal';

const SlugSchema = z.string().max(200).regex(/^[a-z0-9-]+$/);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const { slug } = await context.params;

  const parsed = SlugSchema.safeParse(slug);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid product identifier.' },
      { status: 400, headers: { 'X-Request-Id': requestId } },
    );
  }

  try {
    const product = await getPublishedProductBySlug(parsed.data);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404, headers: { 'X-Request-Id': requestId } },
      );
    }

    return NextResponse.json(product, {
      headers: {
        'X-Request-Id': requestId,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[/api/products/[slug]]', err);
    return NextResponse.json(
      { error: 'Unable to retrieve this product at this time.' },
      { status: 500, headers: { 'X-Request-Id': requestId } },
    );
  }
}
