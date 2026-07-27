// packages/security/events.ts
// SecurityEvent recorder. Records anomalous events asynchronously —
// does not block the request that triggered it.

import { db } from '../db';
import { logger } from '../logger';
import type { SecurityEventSeverity } from '@prisma/client';

export interface SecurityEventInput {
  type: string;
  severity: SecurityEventSeverity;
  riskScore?: number;
  actorUserId?: string;
  sessionId?: string;
  ipHash?: string;
  userAgent?: string;
  country?: string;
  resource?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Records a security event. This is fire-and-forget — errors are logged
 * but not propagated to the caller.
 */
export function recordSecurityEvent(input: SecurityEventInput): void {
  db.securityEvent
    .create({
      data: {
        type: input.type,
        severity: input.severity,
        riskScore: input.riskScore ?? riskScoreForSeverity(input.severity),
        actorUserId: input.actorUserId,
        sessionId: input.sessionId,
        ipHash: input.ipHash,
        userAgent: input.userAgent?.slice(0, 512),
        country: input.country,
        resource: input.resource,
        action: input.action,
        metadata: input.metadata,
      },
    })
    .then(() => {
      if (input.severity === 'HIGH' || input.severity === 'CRITICAL') {
        logger.warn(
          { type: input.type, severity: input.severity, ...input.metadata },
          `Security event: ${input.type}`,
        );
        sendSecurityAlert(input).catch(() => {});
      }
    })
    .catch((err) => {
      logger.error({ err, event: input.type }, 'Failed to record security event');
    });
}

function riskScoreForSeverity(severity: SecurityEventSeverity): number {
  switch (severity) {
    case 'LOW':      return 15;
    case 'MEDIUM':   return 45;
    case 'HIGH':     return 75;
    case 'CRITICAL': return 95;
  }
}

async function sendSecurityAlert(input: SecurityEventInput): Promise<void> {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 *${input.severity} Security Event*: ${input.type}`,
      fields: {
        actor: input.actorUserId ?? 'anonymous',
        country: input.country ?? 'unknown',
        resource: input.resource,
        action: input.action,
      },
    }),
    signal: AbortSignal.timeout(5000),
  });
}

// ─── Well-known event types ───────────────────────────────────────────────────

export const SecurityEventType = {
  // Authentication
  AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
  AUTH_LOGIN_FAILURE: 'AUTH_LOGIN_FAILURE',
  AUTH_LOGIN_FAILURE_BURST: 'AUTH_LOGIN_FAILURE_BURST',
  AUTH_MFA_FAILURE: 'AUTH_MFA_FAILURE',
  AUTH_MFA_FAILURE_BURST: 'AUTH_MFA_FAILURE_BURST',
  AUTH_NEW_COUNTRY: 'AUTH_NEW_COUNTRY',
  AUTH_DISABLED_ACCOUNT_ATTEMPT: 'AUTH_DISABLED_ACCOUNT_ATTEMPT',
  AUTH_SESSION_REVOKED: 'AUTH_SESSION_REVOKED',
  AUTH_ALL_SESSIONS_REVOKED: 'AUTH_ALL_SESSIONS_REVOKED',

  // Admin anomalies
  ADMIN_BULK_DELETE: 'ADMIN_BULK_DELETE',
  ADMIN_LARGE_EXPORT: 'ADMIN_LARGE_EXPORT',
  ADMIN_PERMISSION_CHANGE: 'ADMIN_PERMISSION_CHANGE',
  ADMIN_MFA_RESET: 'ADMIN_MFA_RESET',
  ADMIN_UNAUTHORIZED_ACCESS: 'ADMIN_UNAUTHORIZED_ACCESS',

  // Public anomalies
  PUBLIC_QUOTE_SPAM: 'PUBLIC_QUOTE_SPAM',
  PUBLIC_SCRAPING_DETECTED: 'PUBLIC_SCRAPING_DETECTED',
  PUBLIC_SEARCH_FLOOD: 'PUBLIC_SEARCH_FLOOD',

  // File handling
  FILE_SCAN_FAILED: 'FILE_SCAN_FAILED',
  FILE_MALWARE_DETECTED: 'FILE_MALWARE_DETECTED',
  FILE_SUSPICIOUS_TYPE: 'FILE_SUSPICIOUS_TYPE',

  // Emergency controls
  EMERGENCY_CONTROL: 'EMERGENCY_CONTROL',
} as const;

export type SecurityEventTypeName =
  (typeof SecurityEventType)[keyof typeof SecurityEventType];
