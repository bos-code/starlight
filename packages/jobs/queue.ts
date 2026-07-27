// packages/jobs/queue.ts
// DB-backed durable background job queue.
// Jobs are stored in PostgreSQL — no Redis required for MVP.
// Workers poll and process jobs with exponential backoff and dead-letter handling.

import { db } from '../db';
import { logger } from '../logger';
import type { BackgroundJobStatus } from '@prisma/client';

export type JobType =
  | 'EMAIL'
  | 'IMAGE_PROCESS'
  | 'FILE_SCAN'
  | 'SECURITY_ANALYSIS'
  | 'CLEANUP'
  | 'SEARCH_INDEX';

export interface EnqueueOptions {
  /** When to run. Defaults to now. */
  runAt?: Date;
  /** Max attempts before moving to DEAD. Defaults to 5. */
  maxAttempts?: number;
}

/**
 * Enqueues a background job. Returns the job ID.
 */
export async function enqueue<T extends Record<string, unknown>>(
  type: JobType,
  payload: T,
  options: EnqueueOptions = {},
): Promise<string> {
  const job = await db.backgroundJob.create({
    data: {
      type,
      payload,
      status: 'PENDING',
      nextRunAt: options.runAt ?? new Date(),
      maxAttempts: options.maxAttempts ?? 5,
    },
  });
  return job.id;
}

/**
 * Claims the next available job of the given type(s).
 * Uses a SELECT FOR UPDATE SKIP LOCKED pattern to prevent duplicate processing.
 * Returns null if no job is available.
 */
export async function claimNextJob(
  types: JobType[],
): Promise<{ id: string; type: string; payload: unknown } | null> {
  const now = new Date();

  // We use a raw query to get SKIP LOCKED support
  const results = await db.$queryRaw<Array<{ id: string; type: string; payload: unknown }>>`
    UPDATE background_jobs
    SET status = 'RUNNING',
        "startedAt" = ${now},
        attempts = attempts + 1
    WHERE id = (
      SELECT id FROM background_jobs
      WHERE status = 'PENDING'
        AND type = ANY(${types}::text[])
        AND "nextRunAt" <= ${now}
      ORDER BY "nextRunAt" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id, type, payload
  `;

  return results[0] ?? null;
}

/**
 * Marks a job as successfully completed.
 */
export async function completeJob(jobId: string): Promise<void> {
  await db.backgroundJob.update({
    where: { id: jobId },
    data: { status: 'DONE', completedAt: new Date() },
  });
}

/**
 * Marks a job as failed and schedules a retry with exponential backoff.
 * After maxAttempts, moves to DEAD.
 */
export async function failJob(jobId: string, error: string): Promise<void> {
  const job = await db.backgroundJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  const isExhausted = job.attempts >= job.maxAttempts;

  if (isExhausted) {
    await db.backgroundJob.update({
      where: { id: jobId },
      data: { status: 'DEAD', lastError: error.slice(0, 2000) },
    });
    logger.error({ jobId, type: job.type }, 'Job moved to dead-letter queue');
  } else {
    // Exponential backoff: 1m, 5m, 25m, 2h, 10h
    const backoffMs = Math.min(
      Math.pow(5, job.attempts) * 60 * 1000,
      10 * 60 * 60 * 1000,
    );
    await db.backgroundJob.update({
      where: { id: jobId },
      data: {
        status: 'PENDING',
        lastError: error.slice(0, 2000),
        nextRunAt: new Date(Date.now() + backoffMs),
      },
    });
  }
}
