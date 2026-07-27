// workers/cleanup-worker/index.ts
// Periodic cleanup job. Purges expired sessions, dead jobs, and stale rate limits.

import { db } from '../../packages/db';
import { claimNextJob, completeJob, failJob, enqueue } from '../../packages/jobs/queue';
import { logger } from '../../packages/logger';

export async function processCleanupJob(): Promise<void> {
  const now = new Date();

  // 1. Delete expired sessions
  const deletedSessions = await db.session.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        { absoluteExpiresAt: { lt: now } },
        { revokedAt: { not: null } },
      ],
    },
  });

  // 2. Delete stale rate limits
  const deletedRateLimits = await db.rateLimitEntry.deleteMany({
    where: { windowEnd: { lt: now } },
  });

  // 3. Delete dead jobs older than 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const deletedJobs = await db.backgroundJob.deleteMany({
    where: {
      status: 'DEAD',
      createdAt: { lt: thirtyDaysAgo },
    },
  });

  logger.info(
    {
      sessions: deletedSessions.count,
      rateLimits: deletedRateLimits.count,
      jobs: deletedJobs.count,
    },
    'Cleanup job completed',
  );
}

export async function runCleanupWorker(): Promise<void> {
  const job = await claimNextJob(['CLEANUP']);
  if (!job) return;

  try {
    await processCleanupJob();
    await completeJob(job.id);

    // Re-queue the next cleanup job for 1 hour from now
    await enqueue('CLEANUP', {}, { runAt: new Date(Date.now() + 60 * 60 * 1000) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await failJob(job.id, message);
  }
}
