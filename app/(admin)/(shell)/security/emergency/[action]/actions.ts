'use server';

// app/(admin)/security/emergency/[action]/actions.ts
// Emergency actions execution logic.
// Highly privileged, carefully audited.

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getSessionFromCookie, revokeAllUserSessions } from '../../../../../packages/auth/session';
import { can } from '../../../../../packages/auth/permissions';
import { writeAuditLog } from '../../../../../packages/security/audit';
import { recordSecurityEvent, SecurityEventType } from '../../../../../packages/security/events';
import { db } from '../../../../../packages/db';
import { createHash } from 'crypto';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SESSION_SECRET ?? '')).digest('hex');
}

export async function executeEmergencyAction(formData: FormData) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'security:emergency')) redirect('/admin');

  const actionType = formData.get('actionType') as string;
  const reason = formData.get('reason') as string;

  if (!actionType || !reason || reason.trim().length < 5) {
    throw new Error('Valid reason is required');
  }

  const headerStore = await headers();
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const requestId = headerStore.get('x-request-id') ?? undefined;
  const ipHash = hashIp(ip);

  // 1. Audit Log (always first for emergency actions to ensure record exists)
  await writeAuditLog({
    actorId: session.user.id,
    action: 'EMERGENCY_ACTION_EXECUTED' as any, // Extend AuditAction if needed
    resourceType: 'System',
    newValue: { actionType },
    reason,
    requestId,
  });

  // 2. Security Event
  recordSecurityEvent({
    type: SecurityEventType.EMERGENCY_CONTROL,
    severity: 'CRITICAL',
    actorUserId: session.user.id,
    ipHash,
    action: actionType,
    metadata: { reason },
  });

  // 3. Execution
  if (actionType === 'revoke-sessions') {
    // Revoke all sessions globally (except maybe we want to keep the current one? No, revoke ALL to be safe)
    await db.session.updateMany({
      where: { revokedAt: null },
      data: { revokedAt: new Date(), revokedReason: 'emergency_revoke_all' },
    });
    // Redirecting to login since we just revoked our own session
    redirect('/admin/login?cleared=true');
  } else if (actionType === 'disable-quotes' || actionType === 'disable-uploads' || actionType === 'readonly-mode') {
    // For MVP, these would typically toggle a feature flag in a global settings table.
    // Assuming a singleton AppSettings model exists or we just create a system incident.
    await db.incident.create({
      data: {
        title: `EMERGENCY CONTROL: ${actionType}`,
        status: 'OPEN',
        severity: 'CRITICAL',
        description: `Action triggered by ${session.user.email}. Reason: ${reason}`,
      }
    });
    
    // Redirect back to security centre
    redirect('/admin/security?alert=emergency-activated');
  } else {
    throw new Error('Unknown emergency action');
  }
}
