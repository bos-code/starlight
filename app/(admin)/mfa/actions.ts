'use server';

// app/(admin)/mfa/actions.ts
import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { verifyTotpForUser } from '../../../packages/auth/mfa';
import { recordSecurityEvent, SecurityEventType } from '../../../packages/security/events';
import { writeAuditLog } from '../../../packages/security/audit';
import { cookies } from 'next/headers';

export async function verifyMfaAction(formData: FormData) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');

  const code = formData.get('code') as string;
  if (!code || code.length !== 6) {
    throw new Error('Invalid code');
  }

  const isValid = await verifyTotpForUser(session.user.id, code);

  if (!isValid) {
    recordSecurityEvent({
      type: SecurityEventType.AUTH_MFA_FAILURE,
      severity: 'MEDIUM',
      actorUserId: session.user.id,
      action: 'MFA_VERIFY',
    });
    throw new Error('Invalid code');
  }

  // Set MFA verified flag in session cookie
  const store = await cookies();
  store.set('starlite_mfa', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 28800, // 8 hours matching absolute TTL
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'MFA_VERIFIED' as any,
    resourceType: 'Session',
  });

  redirect('/admin');
}
