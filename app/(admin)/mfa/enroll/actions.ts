'use server';

// app/(admin)/mfa/enroll/actions.ts
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionFromCookie } from '../../../../packages/auth/session';
import { enrollTotp, generateRecoveryCodes } from '../../../../packages/auth/mfa';
import { writeAuditLog } from '../../../../packages/security/audit';
import { recordSecurityEvent, SecurityEventType } from '../../../../packages/security/events';

export async function enrollMfaAction(formData: FormData) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (session.user.mfaEnrolled) redirect('/admin');

  const rawSecret = formData.get('rawSecret') as string;
  const code = formData.get('code') as string;

  if (!rawSecret || !code || code.length !== 6) {
    throw new Error('Invalid submission');
  }

  const result = await enrollTotp(session.user.id, rawSecret, code);

  if (!result.success) {
    throw new Error(result.error ?? 'Verification failed');
  }

  // Generate initial recovery codes
  await generateRecoveryCodes(session.user.id);

  // Set MFA verified flag in session cookie
  const store = await cookies();
  store.set('starlite_mfa', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 28800,
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'MFA_ENROLLED' as any,
    resourceType: 'User',
    resourceId: session.user.id,
  });

  // Event recording
  recordSecurityEvent({
    type: 'AUTH_MFA_ENROLLED' as any,
    severity: 'LOW',
    actorUserId: session.user.id,
    action: 'MFA_ENROLL',
  });

  // Redirect to a page that displays recovery codes
  redirect('/admin/mfa/recovery');
}
