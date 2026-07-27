// app/api/quotes/route.ts
// Public quote submission endpoint.
// Rate limited, idempotency-safe, fully validated.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { submitQuote } from '../../../packages/quotes/quotes.dal';
import { checkRateLimit, RATE_LIMITS } from '../../../packages/security/rate-limit';
import { recordSecurityEvent, SecurityEventType } from '../../../packages/security/events';
import { createHash } from 'crypto';

// ─── Input validation schema ──────────────────────────────────────────────────

const QuoteSubmissionSchema = z.object({
  idempotencyKey: z.string().min(16).max(128),
  buyerType: z.enum(['INDIVIDUAL', 'DEALER', 'CONTRACTOR', 'COMPANY', 'PROCUREMENT_TEAM']),
  contactName: z.string().min(2).max(200).trim(),
  contactEmail: z.string().email().max(320).optional().or(z.literal('')),
  contactPhone: z.string().min(7).max(30).trim(),
  businessName: z.string().max(300).optional(),
  deliveryLocation: z.string().max(500).optional(),
  isCollection: z.boolean().optional().default(false),
  requiredByDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(10000),
        note: z.string().max(500).optional(),
      }),
    )
    .min(1)
    .max(100),
});

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SESSION_SECRET ?? '')).digest('hex');
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const ipHash = hashIp(ip);

  // ── Rate limiting ───────────────────────────────────────────
  const rateCheck = await checkRateLimit(RATE_LIMITS.quote, ipHash);
  if (!rateCheck.allowed) {
    recordSecurityEvent({
      type: SecurityEventType.PUBLIC_QUOTE_SPAM,
      severity: 'MEDIUM',
      ipHash,
      action: 'QUOTE_SUBMIT',
      metadata: { resetAt: rateCheck.resetAt },
    });

    return NextResponse.json(
      {
        error:
          'Too many quotation requests from this connection. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-Request-Id': requestId,
          'Retry-After': String(Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000)),
        },
      },
    );
  }

  // ── Parse body ──────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400, headers: { 'X-Request-Id': requestId } },
    );
  }

  // Request size guard (10 KB)
  const contentLength = parseInt(request.headers.get('content-length') ?? '0', 10);
  if (contentLength > 10 * 1024) {
    return NextResponse.json(
      { error: 'Request too large.' },
      { status: 413, headers: { 'X-Request-Id': requestId } },
    );
  }

  const parsed = QuoteSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid submission.', details: parsed.error.flatten().fieldErrors },
      { status: 422, headers: { 'X-Request-Id': requestId } },
    );
  }

  const data = parsed.data;

  // ── Submit ──────────────────────────────────────────────────
  try {
    const result = await submitQuote({
      ...data,
      contactEmail: data.contactEmail || undefined,
      requiredByDate: data.requiredByDate ? new Date(data.requiredByDate) : undefined,
    });

    return NextResponse.json(result, {
      status: result.submissionStatus === 'CREATED' ? 201 : 200,
      headers: { 'X-Request-Id': requestId },
    });
  } catch (err) {
    console.error('[POST /api/quotes]', err);
    return NextResponse.json(
      { error: 'Unable to submit your quotation request at this time. Please try again.' },
      { status: 500, headers: { 'X-Request-Id': requestId } },
    );
  }
}
