// workers/email-worker/index.ts
// Handles sending emails asynchronously.
// Integrates with an external email provider (e.g. Resend, Postmark).
// Records failures and relies on the job queue's exponential backoff.

import { claimNextJob, completeJob, failJob } from '../../packages/jobs/queue';
import { logger } from '../../packages/logger';
import { db } from '../../packages/db';

interface EmailPayload {
  to: string;
  subject: string;
  template: 'STAFF_INVITATION' | 'QUOTE_RECEIVED' | 'QUOTE_UPDATED';
  data: Record<string, any>;
}

export async function processEmailJob(payload: EmailPayload): Promise<void> {
  const log = logger.child({ to: payload.to, template: payload.template });
  
  // MVP: Simply log the email since we don't have a real email provider configured.
  log.info({ data: payload.data }, 'Simulating email send');

  // If we had a real provider like Resend:
  // const res = await resend.emails.send({
  //   from: 'Starlite Tools <no-reply@starlite.example.com>',
  //   to: payload.to,
  //   subject: payload.subject,
  //   html: renderTemplate(payload.template, payload.data),
  // });
  // if (res.error) throw new Error(res.error.message);

  // For testing/seed purposes, if this is an invitation, output it securely to the log
  if (payload.template === 'STAFF_INVITATION') {
    log.info(`INVITATION LINK: http://localhost:3000/admin/invite?token=${payload.data.token}`);
  }
}

export async function runEmailWorker(): Promise<void> {
  const job = await claimNextJob(['EMAIL']);
  if (!job) return;

  try {
    await processEmailJob(job.payload as EmailPayload);
    await completeJob(job.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await failJob(job.id, message);
  }
}
