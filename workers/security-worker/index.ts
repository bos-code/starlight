// workers/security-worker/index.ts
// Analyzes accumulated security events to detect slow patterns, 
// distributed credential stuffing, and botnets.

import { db } from '../../packages/db';
import { claimNextJob, completeJob, failJob, enqueue } from '../../packages/jobs/queue';
import { logger } from '../../packages/logger';

export async function processSecurityJob(): Promise<void> {
  const log = logger.child({ worker: 'security-worker' });
  
  // Example analysis: Detect multiple accounts failing login from the same country
  // within the last hour (credential stuffing indicator).
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const failedLogins = await db.securityEvent.groupBy({
    by: ['country'],
    where: {
      type: 'AUTH_LOGIN_FAILURE',
      occurredAt: { gte: oneHourAgo },
      country: { not: null },
    },
    _count: {
      id: true,
    },
  });

  for (const group of failedLogins) {
    if (group._count.id > 100) {
      log.warn({ country: group.country, count: group._count.id }, 'High volume of failed logins from country');
      // If we had a global WAF integration, we might push an IP/country ban rule here.
      // For MVP, we create a system incident.
      await db.incident.create({
        data: {
          title: `High Failed Logins: ${group.country}`,
          status: 'OPEN',
          severity: 'HIGH',
          description: `Detected ${group._count.id} failed logins from ${group.country} in the last hour. Potential credential stuffing.`,
        },
      });
    }
  }
}

export async function runSecurityWorker(): Promise<void> {
  const job = await claimNextJob(['SECURITY_ANALYSIS']);
  if (!job) return;

  try {
    await processSecurityJob();
    await completeJob(job.id);

    // Re-queue for next hour
    await enqueue('SECURITY_ANALYSIS', {}, { runAt: new Date(Date.now() + 60 * 60 * 1000) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await failJob(job.id, message);
  }
}
