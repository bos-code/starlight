// packages/quotes/quotes.dal.ts
// Data Access Layer for quotation requests.

import { db } from '../db';
import { writeAuditLog } from '../security/audit';
import type { BuyerType, QuoteStatus } from '@prisma/client';

// ─── Reference generation ────────────────────────────────────────────────────

async function generateQuoteReference(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.quote.count({
    where: { reference: { startsWith: `STL-${year}-` } },
  });
  const seq = String(count + 1).padStart(5, '0');
  return `STL-${year}-${seq}`;
}

// ─── Public submission ────────────────────────────────────────────────────────

export interface QuoteSubmissionInput {
  idempotencyKey: string;
  buyerType: BuyerType;
  contactName: string;
  contactEmail?: string;
  contactPhone: string;
  businessName?: string;
  deliveryLocation?: string;
  isCollection?: boolean;
  requiredByDate?: Date;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
    note?: string;
  }>;
}

export interface QuoteSubmissionResult {
  quoteReference: string;
  submissionStatus: 'CREATED' | 'DUPLICATE';
  receivedAt: Date;
}

/**
 * Creates a quote or returns an existing one if the idempotency key matches.
 * This allows safe retries without duplicate submissions.
 */
export async function submitQuote(
  input: QuoteSubmissionInput,
): Promise<QuoteSubmissionResult> {
  // Check idempotency key first
  const existing = await db.quote.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
    select: { reference: true, createdAt: true },
  });

  if (existing) {
    return {
      quoteReference: existing.reference,
      submissionStatus: 'DUPLICATE',
      receivedAt: existing.createdAt,
    };
  }

  const reference = await generateQuoteReference();

  const quote = await db.$transaction(async (tx) => {
    const q = await tx.quote.create({
      data: {
        reference,
        idempotencyKey: input.idempotencyKey,
        buyerType: input.buyerType,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        businessName: input.businessName,
        deliveryLocation: input.deliveryLocation,
        isCollection: input.isCollection ?? false,
        requiredByDate: input.requiredByDate,
        notes: input.notes,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            note: item.note,
          })),
        },
      },
    });

    // Record initial status history
    await tx.quoteStatusHistory.create({
      data: {
        quoteId: q.id,
        fromStatus: null,
        toStatus: 'NEW',
      },
    });

    return q;
  });

  return {
    quoteReference: quote.reference,
    submissionStatus: 'CREATED',
    receivedAt: quote.createdAt,
  };
}

// ─── Public status lookup ─────────────────────────────────────────────────────

/**
 * Returns minimal public-safe status for a quote reference.
 * Does NOT expose contact details or pricing.
 */
export async function getPublicQuoteStatus(reference: string) {
  return db.quote.findUnique({
    where: { reference },
    select: {
      reference: true,
      status: true,
      createdAt: true,
    },
  });
}

// ─── Admin reads ──────────────────────────────────────────────────────────────

export interface AdminQuoteFilters {
  status?: QuoteStatus;
  buyerType?: BuyerType;
  search?: string;
  assignedToId?: string;
  page?: number;
  limit?: number;
}

export async function adminGetQuotes(filters: AdminQuoteFilters = {}) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 25));
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.buyerType ? { buyerType: filters.buyerType } : {}),
    ...(filters.search
      ? {
          OR: [
            { reference: { contains: filters.search, mode: 'insensitive' as const } },
            { contactName: { contains: filters.search, mode: 'insensitive' as const } },
            { contactPhone: { contains: filters.search, mode: 'insensitive' as const } },
            { businessName: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [quotes, total] = await Promise.all([
    db.quote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        reference: true,
        status: true,
        buyerType: true,
        contactName: true,
        contactPhone: true,
        businessName: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
    }),
    db.quote.count({ where }),
  ]);

  return { quotes, total, page, totalPages: Math.ceil(total / limit) };
}

export async function adminGetQuoteById(id: string) {
  return db.quote.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { name: true, slug: true, sku: true } } } },
      attachments: { select: { id: true, originalName: true, fileStatus: true, uploadedAt: true } },
      statusHistory: { orderBy: { changedAt: 'desc' } },
      internalNotes: { orderBy: { createdAt: 'desc' } },
      assignments: { include: { user: { select: { name: true, email: true } } } },
    },
  });
}

// ─── Admin writes ─────────────────────────────────────────────────────────────

export async function updateQuoteStatus(
  quoteId: string,
  newStatus: QuoteStatus,
  actorId: string,
  reason?: string,
  requestId?: string,
) {
  const existing = await db.quote.findUnique({
    where: { id: quoteId },
    select: { status: true },
  });
  if (!existing) throw new Error('Quote not found');

  const [quote] = await db.$transaction([
    db.quote.update({
      where: { id: quoteId },
      data: {
        status: newStatus,
        ...(newStatus === 'CLOSED' || newStatus === 'WON' || newStatus === 'REJECTED'
          ? { closedAt: new Date() }
          : {}),
      },
    }),
    db.quoteStatusHistory.create({
      data: {
        quoteId,
        fromStatus: existing.status,
        toStatus: newStatus,
        changedById: actorId,
        reason,
      },
    }),
  ]);

  await writeAuditLog({
    actorId,
    action: 'QUOTE_STATUS_CHANGED',
    resourceType: 'Quote',
    resourceId: quoteId,
    previousValue: { status: existing.status },
    newValue: { status: newStatus },
    requestId,
    reason,
  });

  return quote;
}

export async function addQuoteInternalNote(
  quoteId: string,
  content: string,
  authorId: string,
  requestId?: string,
) {
  const note = await db.quoteInternalNote.create({
    data: { quoteId, content, authorId },
  });

  await writeAuditLog({
    actorId: authorId,
    action: 'QUOTE_NOTE_ADDED',
    resourceType: 'Quote',
    resourceId: quoteId,
    requestId,
  });

  return note;
}

export async function setQuoteItemPrice(
  itemId: string,
  unitPrice: number,
  currency: string,
  actorId: string,
  requestId?: string,
) {
  const item = await db.quoteItem.update({
    where: { id: itemId },
    data: { unitPrice, currency },
  });

  await writeAuditLog({
    actorId,
    action: 'QUOTE_PRICE_UPDATED',
    resourceType: 'QuoteItem',
    resourceId: itemId,
    newValue: { unitPrice, currency },
    requestId,
  });

  return item;
}
