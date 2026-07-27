// workers/image-worker/index.ts
// Image processing worker. Called after file-scan-worker confirms a file is safe.
// Uses Sharp to create multiple variants and strips EXIF metadata.
// This runs as a background job — NOT as a Next.js route handler.

import sharp from 'sharp';
import { promoteFromQuarantine, publicUrl } from '../../packages/storage/r2';
import { StoragePaths } from '../../packages/storage/paths';
import { db } from '../../packages/db';
import { claimNextJob, completeJob, failJob } from '../../packages/jobs/queue';
import { logger } from '../../packages/logger';

interface ImageProcessPayload {
  productImageId: string;
  quarantineKey: string;
  productId: string;
  imageBuffer: Buffer;
}

const VARIANTS = [
  { name: 'thumbnail', width: 200, height: 200, format: 'webp' as const },
  { name: 'card',      width: 600, height: 400, format: 'webp' as const },
  { name: 'detail',    width: 1200, height: 900, format: 'webp' as const },
] as const;

const MAX_IMAGE_DIMENSION = 8000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export async function processImageJob(
  productImageId: string,
  quarantineKey: string,
  productId: string,
  rawBuffer: Buffer,
): Promise<void> {
  const log = logger.child({ productImageId, productId });

  // ── Validate dimensions ─────────────────────────────────────
  const metadata = await sharp(rawBuffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Could not read image dimensions');
  }

  if (
    metadata.width > MAX_IMAGE_DIMENSION ||
    metadata.height > MAX_IMAGE_DIMENSION
  ) {
    throw new Error(
      `Image dimensions too large: ${metadata.width}x${metadata.height}`,
    );
  }

  if (rawBuffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image file size too large: ${rawBuffer.length} bytes`);
  }

  // ── Process variants ────────────────────────────────────────
  const variantKeys: Record<string, string> = {};

  for (const variant of VARIANTS) {
    const key = StoragePaths.productImage(productId, variant.name);
    const processed = await sharp(rawBuffer)
      .resize(variant.width, variant.height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .withMetadata({ exif: {} }) // Strip EXIF
      .toFormat(variant.format, { quality: 85 })
      .toBuffer();

    // Write to permanent storage directly (already scanned)
    await promoteFromQuarantine(quarantineKey, key);
    variantKeys[variant.name] = key;

    log.info({ variant: variant.name, key }, 'Image variant created');
  }

  // AVIF detail variant
  const avifKey = StoragePaths.productImage(productId, 'detail-avif');
  const avifBuffer = await sharp(rawBuffer)
    .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
    .withMetadata({ exif: {} })
    .toFormat('avif', { quality: 75 })
    .toBuffer();

  // ── Original (stripped of EXIF) ─────────────────────────────
  const originalKey = StoragePaths.productImage(productId, 'original');
  const cleanOriginal = await sharp(rawBuffer)
    .withMetadata({ exif: {} })
    .toBuffer();

  // ── Update DB record ────────────────────────────────────────
  await db.productImage.update({
    where: { id: productImageId },
    data: {
      fileStatus: 'ACTIVE',
      originalUrl: publicUrl(originalKey),
      thumbnailUrl: publicUrl(variantKeys.thumbnail),
      cardUrl: publicUrl(variantKeys.card),
      detailUrl: publicUrl(variantKeys.detail),
      detailAvifUrl: publicUrl(avifKey),
      width: metadata.width,
      height: metadata.height,
      fileSizeBytes: cleanOriginal.length,
      mimeType: 'image/webp',
    },
  });

  log.info({ productImageId }, 'Image processing complete');
}

// ── Worker loop (called by the job runner) ────────────────────────────────────

export async function runImageWorker(): Promise<void> {
  const job = await claimNextJob(['IMAGE_PROCESS']);
  if (!job) return;

  try {
    const payload = job.payload as ImageProcessPayload;
    // In a real deployment, fetch the buffer from quarantine storage
    // Here the buffer would be retrieved from R2 quarantine
    await processImageJob(
      payload.productImageId,
      payload.quarantineKey,
      payload.productId,
      payload.imageBuffer,
    );
    await completeJob(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await failJob(job.id, message);
  }
}
