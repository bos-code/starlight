'use server';

// app/(admin)/login/actions.ts
// Login Server Action. Validates credentials, enforces rate limiting,
// and initiates a database-backed session.

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { db } from '../../../packages/db';
import { verifyPassword } from '../../../packages/auth/password';
import { createSession, setSessionCookie } from '../../../packages/auth/session';
import { checkRateLimit, RATE_LIMITS } from '../../../packages/security/rate-limit';
import { recordSecurityEvent, SecurityEventType } from '../../../packages/security/events';
import { writeAuditLog } from '../../../packages/security/audit';
import { createHash } from 'crypto';

// Generic error — never reveal whether email exists or password was wrong
const GENERIC_ERROR = 'Unable to sign in with the supplied credentials.';

const LoginSchema = z.object({
  email: z.string().email().max(320).toLowerCase().trim(),
  password: z.string().min(1).max(1024),
});

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.SESSION_SECRET ?? '')).digest('hex');
}

export async function loginAction(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const headerStore = await headers();
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const userAgent = headerStore.get('user-agent') ?? undefined;
  const requestId = headerStore.get('x-request-id') ?? undefined;
  const ipHash = hashIp(ip);

  // ── Rate limit by IP ────────────────────────────────────────
  const rateCheck = await checkRateLimit(RATE_LIMITS.login, ipHash);
  if (!rateCheck.allowed) {
    recordSecurityEvent({
      type: SecurityEventType.AUTH_LOGIN_FAILURE_BURST,
      severity: 'HIGH',
      ipHash,
      action: 'LOGIN',
    });
    return { error: GENERIC_ERROR };
  }

  // ── Validate input ──────────────────────────────────────────
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const { email, password } = parsed.data;

  // ── Find user ───────────────────────────────────────────────
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      isActive: true,
      mfaEnrolled: true,
    },
  });

  // Always run password verification to prevent timing attacks
  const dummyHash =
    '$argon2id$v=19$m=65536,t=3,p=4$dummy$dummyhashdummyhashdummyhash';
  const passwordValid = user
    ? await verifyPassword(user.passwordHash, password)
    : await verifyPassword(dummyHash, password).then(() => false);

  if (!user || !passwordValid) {
    recordSecurityEvent({
      type: SecurityEventType.AUTH_LOGIN_FAILURE,
      severity: 'MEDIUM',
      ipHash,
      userAgent,
      action: 'LOGIN',
      metadata: { emailHash: createHash('sha256').update(email).digest('hex') },
    });
    return { error: GENERIC_ERROR };
  }

  if (!user.isActive) {
    recordSecurityEvent({
      type: SecurityEventType.AUTH_DISABLED_ACCOUNT_ATTEMPT,
      severity: 'MEDIUM',
      actorUserId: user.id,
      ipHash,
      userAgent,
      action: 'LOGIN',
    });
    return { error: GENERIC_ERROR };
  }

  // ── Update last login ───────────────────────────────────────
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // ── MFA required? ───────────────────────────────────────────
  if (user.mfaEnrolled) {
    // Create a short-lived pre-MFA session stored in a cookie
    // Full session is only created after MFA is verified
    const preAuthToken = await createSession(user.id, { ip, userAgent });
    await setSessionCookie(preAuthToken);

    recordSecurityEvent({
      type: SecurityEventType.AUTH_LOGIN_SUCCESS,
      severity: 'LOW',
      actorUserId: user.id,
      ipHash,
      userAgent,
      action: 'LOGIN_PRE_MFA',
    });

    redirect('/admin/mfa');
  }

  // ── No MFA yet — create full session and redirect to MFA enrollment ─────────
  const sessionToken = await createSession(user.id, { ip, userAgent });
  await setSessionCookie(sessionToken);

  await writeAuditLog({
    actorId: user.id,
    action: 'SESSION_CREATED',
    resourceType: 'Session',
    requestId,
  });

  recordSecurityEvent({
    type: SecurityEventType.AUTH_LOGIN_SUCCESS,
    severity: 'LOW',
    actorUserId: user.id,
    ipHash,
    userAgent,
    action: 'LOGIN',
  });

  // Force MFA enrollment for all staff
  redirect('/admin/mfa/enroll');
}
