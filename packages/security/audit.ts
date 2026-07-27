// packages/security/audit.ts
// Append-only audit log writer.
// No update or delete operations on AuditLog exist in this module.
// Enforced by convention — the Prisma model also has no explicit
// update/delete operations permitted in admin roles.

import { db } from '../db';
import { logger } from '../logger';
import type { AuditAction } from '@prisma/client';

export interface AuditLogInput {
  actorId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  requestId?: string;
  sessionId?: string;
  reason?: string;
}

/**
 * Writes an immutable audit log entry. Fire-and-forget on failures —
 * the primary operation should never fail just because audit logging failed.
 * Critical security events should also be recorded via recordSecurityEvent.
 */
export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        previousValue: input.previousValue ? JSON.parse(JSON.stringify(input.previousValue)) : undefined,
        newValue: input.newValue ? JSON.parse(JSON.stringify(input.newValue)) : undefined,
        requestId: input.requestId,
        sessionId: input.sessionId,
        reason: input.reason,
      },
    });
  } catch (err) {
    // Log the failure but do not propagate — audit log failure should not
    // break the business operation.
    logger.error({ err, action: input.action }, 'Failed to write audit log');
  }
}

/**
 * Convenience wrapper: writes audit log and returns void.
 * Suitable for use after a successful mutation in a Server Action.
 */
export function auditLog(input: AuditLogInput): void {
  writeAuditLog(input).catch(() => {});
}
