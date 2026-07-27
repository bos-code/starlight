// packages/storage/r2.ts
// Cloudflare R2 client using the S3-compatible API.
// Provides helpers for presigned uploads, presigned downloads, and object management.

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../logger';

function createR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// Lazy singletons — only initialised when first used (avoids build-time errors)
let _client: S3Client | null = null;
let _quarantineClient: S3Client | null = null;

function getClient(): S3Client {
  return (_client ??= createR2Client());
}

const MAIN_BUCKET = process.env.R2_BUCKET_NAME!;
const QUARANTINE_BUCKET = process.env.R2_QUARANTINE_BUCKET_NAME!;

// ─── Presigned upload (to quarantine) ────────────────────────────────────────

export interface PresignedUploadResult {
  uploadUrl: string;
  storageKey: string;
  expiresAt: Date;
}

/**
 * Creates a short-lived presigned URL for the browser to upload directly to R2
 * quarantine bucket. The file lands in quarantine and must be validated before
 * being promoted to permanent storage.
 */
export async function createPresignedUploadUrl(
  storageKey: string,
  mimeType: string,
  maxBytes: number,
  ttlSeconds = 900,
): Promise<PresignedUploadResult> {
  const command = new PutObjectCommand({
    Bucket: QUARANTINE_BUCKET,
    Key: storageKey,
    ContentType: mimeType,
    ContentLength: maxBytes,
  });

  const uploadUrl = await getSignedUrl(getClient(), command, {
    expiresIn: ttlSeconds,
  });

  return {
    uploadUrl,
    storageKey,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
  };
}

// ─── Promote from quarantine to permanent storage ─────────────────────────────

/**
 * Moves a file from the quarantine bucket to the permanent bucket.
 * Called by the file-scan worker after a file passes validation.
 */
export async function promoteFromQuarantine(
  quarantineKey: string,
  permanentKey: string,
): Promise<void> {
  const client = getClient();

  // Copy from quarantine to main bucket
  await client.send(
    new CopyObjectCommand({
      CopySource: `${QUARANTINE_BUCKET}/${quarantineKey}`,
      Bucket: MAIN_BUCKET,
      Key: permanentKey,
    }),
  );

  // Delete from quarantine
  await client.send(
    new DeleteObjectCommand({
      Bucket: QUARANTINE_BUCKET,
      Key: quarantineKey,
    }),
  );

  logger.info({ quarantineKey, permanentKey }, 'File promoted from quarantine');
}

// ─── Presigned download (private documents) ───────────────────────────────────

/**
 * Creates a short-lived presigned download URL for a private file.
 * Use for quote attachments and private product documents.
 */
export async function createPresignedDownloadUrl(
  key: string,
  ttlSeconds = 300,
  fileName?: string,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: MAIN_BUCKET,
    Key: key,
    ...(fileName
      ? {
          ResponseContentDisposition: `attachment; filename="${fileName.replace(/"/g, '')}"`,
        }
      : {}),
  });

  return getSignedUrl(getClient(), command, { expiresIn: ttlSeconds });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteObject(key: string, bucket?: string): Promise<void> {
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: bucket ?? MAIN_BUCKET,
      Key: key,
    }),
  );
}

export async function deleteQuarantineObject(key: string): Promise<void> {
  return deleteObject(key, QUARANTINE_BUCKET);
}

// ─── Public URL ───────────────────────────────────────────────────────────────

/**
 * Returns the public CDN URL for an asset in the main bucket.
 * Only use for product images that have been marked ACTIVE.
 * Never expose quarantine URLs publicly.
 */
export function publicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, '');
  return `${base}/${key}`;
}
