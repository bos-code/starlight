// app/api/uploads/presign/route.ts
// Issues presigned upload URLs for direct browser-to-R2 uploads.
// Files land in quarantine first — the file-scan worker validates them.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createPresignedUploadUrl } from '../../../../packages/storage/r2';
import {
  StoragePaths,
  ALLOWED_QUOTE_ATTACHMENT_TYPES,
  ALLOWED_PRODUCT_IMAGE_TYPES,
  ALLOWED_PRODUCT_DOCUMENT_TYPES,
  MAX_FILE_SIZES,
  MAX_FILES_PER_QUOTE,
} from '../../../../packages/storage/paths';
import { getSessionFromCookie } from '../../../../packages/auth/session';
import { can } from '../../../../packages/auth/permissions';
import { checkRateLimit, RATE_LIMITS } from '../../../../packages/security/rate-limit';
import { db } from '../../../../packages/db';
import { createHash } from 'crypto';

const PresignRequestSchema = z.discriminatedUnion('purpose', [
  z.object({
    purpose: z.literal('QUOTE_ATTACHMENT'),
    quoteId: z.string().uuid(),
    mimeType: z.string().max(100),
    sizeBytes: z.number().int().min(1).max(MAX_FILE_SIZES.quoteAttachment),
    originalName: z.string().max(255),
  }),
  z.object({
    purpose: z.literal('PRODUCT_IMAGE'),
    productId: z.string().uuid(),
    mimeType: z.string().max(100),
    sizeBytes: z.number().int().min(1).max(MAX_FILE_SIZES.productImage),
    originalName: z.string().max(255),
  }),
  z.object({
    purpose: z.literal('PRODUCT_DOCUMENT'),
    productId: z.string().uuid(),
    mimeType: z.string().max(100),
    sizeBytes: z.number().int().min(1).max(MAX_FILE_SIZES.productDocument),
    originalName: z.string().max(255),
  }),
]);

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SESSION_SECRET ?? '')).digest('hex');
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // ── Rate limiting ───────────────────────────────────────────────────────────
  const rateCheck = await checkRateLimit(RATE_LIMITS.presign, hashIp(ip));
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Upload rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'X-Request-Id': requestId } },
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = PresignRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid upload request.', details: parsed.error.flatten().fieldErrors },
      { status: 422, headers: { 'X-Request-Id': requestId } },
    );
  }

  const data = parsed.data;

  // ── Validate MIME type against allowlist ────────────────────────────────────
  let allowedTypes: Set<string>;
  if (data.purpose === 'QUOTE_ATTACHMENT') {
    allowedTypes = ALLOWED_QUOTE_ATTACHMENT_TYPES;
  } else if (data.purpose === 'PRODUCT_IMAGE') {
    allowedTypes = ALLOWED_PRODUCT_IMAGE_TYPES;
  } else {
    allowedTypes = ALLOWED_PRODUCT_DOCUMENT_TYPES;
  }

  if (!allowedTypes.has(data.mimeType)) {
    return NextResponse.json(
      { error: 'File type not permitted.' },
      { status: 422, headers: { 'X-Request-Id': requestId } },
    );
  }

  // ── Auth & permission check for admin uploads ───────────────────────────────
  if (data.purpose === 'PRODUCT_IMAGE' || data.purpose === 'PRODUCT_DOCUMENT') {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    if (!can(session.user.role, 'media:upload')) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }
  }

  // ── Quote attachment: verify quote exists and check file count ──────────────
  if (data.purpose === 'QUOTE_ATTACHMENT') {
    const quote = await db.quote.findUnique({
      where: { id: data.quoteId },
      select: { _count: { select: { attachments: true } } },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
    }

    if (quote._count.attachments >= MAX_FILES_PER_QUOTE) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES_PER_QUOTE} attachments per quotation.` },
        { status: 422 },
      );
    }
  }

  // ── Generate quarantine path and presign ────────────────────────────────────
  const quarantineKey = StoragePaths.quarantine();

  const presigned = await createPresignedUploadUrl(
    quarantineKey,
    data.mimeType,
    data.sizeBytes,
    900, // 15 minutes
  );

  // ── Create pending DB record ────────────────────────────────────────────────
  if (data.purpose === 'QUOTE_ATTACHMENT') {
    await db.quoteAttachment.create({
      data: {
        quoteId: data.quoteId,
        originalName: data.originalName.slice(0, 255),
        storagePath: quarantineKey,
        mimeType: data.mimeType,
        fileSizeBytes: data.sizeBytes,
        fileStatus: 'PENDING_SCAN',
      },
    });
  } else if (data.purpose === 'PRODUCT_IMAGE') {
    await db.productImage.create({
      data: {
        productId: data.productId,
        originalUrl: quarantineKey,
        mimeType: data.mimeType,
        fileSizeBytes: data.sizeBytes,
        fileStatus: 'PENDING_SCAN',
      },
    });
  } else {
    // PRODUCT_DOCUMENT
    await db.productDocument.create({
      data: {
        productId: data.productId,
        name: data.originalName.slice(0, 255),
        type: 'other',
        url: quarantineKey,
        mimeType: data.mimeType,
        fileSizeBytes: data.sizeBytes,
        fileStatus: 'PENDING_SCAN',
      },
    });
  }

  return NextResponse.json(
    {
      uploadUrl: presigned.uploadUrl,
      storageKey: quarantineKey,
      expiresAt: presigned.expiresAt,
    },
    { headers: { 'X-Request-Id': requestId } },
  );
}
