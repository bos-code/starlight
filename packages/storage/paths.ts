// packages/storage/paths.ts
// Server-side path generation for R2 storage.
// NEVER use user-supplied filenames as storage paths.
// All paths are generated server-side using random IDs.

import { randomBytes } from 'crypto';

function generateId(): string {
  return randomBytes(16).toString('hex');
}

export const StoragePaths = {
  /** Quarantine zone — unvalidated uploads land here first */
  quarantine(id?: string): string {
    return `quarantine/${id ?? generateId()}`;
  },

  /** Permanent product image variants */
  productImage(productId: string, variant: 'original' | 'thumbnail' | 'card' | 'detail' | 'detail-avif'): string {
    return `products/${productId}/${variant}-${generateId()}.${variant === 'detail-avif' ? 'avif' : 'webp'}`;
  },

  /** Product documents (manuals, datasheets, etc.) */
  productDocument(productId: string, extension: string): string {
    const safeExt = extension.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 5);
    return `products/${productId}/docs/${generateId()}.${safeExt}`;
  },

  /** Quote attachments — always private */
  quoteAttachment(quoteId: string, extension: string): string {
    const safeExt = extension.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 5);
    return `quotes/${quoteId}/attachments/${generateId()}.${safeExt}`;
  },

  /** Category images */
  categoryImage(categoryId: string): string {
    return `categories/${categoryId}/${generateId()}.webp`;
  },

  /** Brand logos */
  brandLogo(brandId: string): string {
    return `brands/${brandId}/${generateId()}.webp`;
  },
};

// ─── Allowed upload MIME types ────────────────────────────────────────────────

export const ALLOWED_QUOTE_ATTACHMENT_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/jpeg',
  'image/png',
]);

export const ALLOWED_PRODUCT_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const ALLOWED_PRODUCT_DOCUMENT_TYPES = new Set([
  'application/pdf',
]);

/** Returns the canonical extension for a given MIME type */
export function extensionForMime(mime: string): string {
  const map: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/csv': 'csv',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
  };
  return map[mime] ?? 'bin';
}

export const MAX_FILE_SIZES = {
  quoteAttachment: 20 * 1024 * 1024,  // 20 MiB
  productImage: 10 * 1024 * 1024,     // 10 MiB
  productDocument: 50 * 1024 * 1024,  // 50 MiB
};

export const MAX_FILES_PER_QUOTE = 5;
