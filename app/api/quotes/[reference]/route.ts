// app/api/quotes/[reference]/route.ts
// Public quote status lookup by reference number.
// Returns minimal data only — no contact details, pricing, or attachments.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPublicQuoteStatus } from '../../../../packages/quotes/quotes.dal';

const ReferenceSchema = z.string().regex(/^STL-\d{4}-\d{5}$/);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reference: string }> },
) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const { reference } = await context.params;

  const parsed = ReferenceSchema.safeParse(reference);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid reference format.' },
      { status: 400, headers: { 'X-Request-Id': requestId } },
    );
  }

  try {
    const quote = await getPublicQuoteStatus(parsed.data);

    if (!quote) {
      // Use same message for not-found and invalid to prevent enumeration
      return NextResponse.json(
        { error: 'No quotation found with that reference.' },
        { status: 404, headers: { 'X-Request-Id': requestId } },
      );
    }

    return NextResponse.json(quote, {
      headers: {
        'X-Request-Id': requestId,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[GET /api/quotes/[reference]]', err);
    return NextResponse.json(
      { error: 'Unable to retrieve quotation status at this time.' },
      { status: 500, headers: { 'X-Request-Id': requestId } },
    );
  }
}
