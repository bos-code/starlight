// packages/auth/session.ts
// Database-backed session management.
// Sessions are stored in PostgreSQL and verified on every request.
// No JWTs — this allows instant remote revocation.

import { cookies } from 'next/headers';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { db } from '../db';
import { logger } from '../logger';
import type { Role } from '@prisma/client';

const SESSION_COOKIE_NAME = 'starlite_session';
const SESSION_SECRET = process.env.SESSION_SECRET!;
const IDLE_TTL_MS =
  parseInt(process.env.SESSION_IDLE_TTL_SECONDS ?? '1800', 10) * 1000;
const ABSOLUTE_TTL_MS =
  parseInt(process.env.SESSION_ABSOLUTE_TTL_SECONDS ?? '28800', 10) * 1000;
const MAX_CONCURRENT = parseInt(
  process.env.SESSION_MAX_CONCURRENT ?? '3',
  10,
);

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  mfaEnrolled: boolean;
}

export interface ActiveSession {
  sessionId: string;
  user: SessionUser;
  country: string | null;
}

// ─── Token helpers ────────────────────────────────────────────────────────────

function generateRawToken(): string {
  return randomBytes(48).toString('base64url');
}

function hashToken(raw: string): string {
  return createHash('sha256')
    .update(raw + SESSION_SECRET)
    .digest('hex');
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + SESSION_SECRET).digest('hex');
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createSession(
  userId: string,
  meta: { ip?: string; userAgent?: string; country?: string },
): Promise<string> {
  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + IDLE_TTL_MS);
  const absoluteExpiresAt = new Date(now.getTime() + ABSOLUTE_TTL_MS);

  // Enforce max concurrent sessions — revoke oldest if over limit
  const existing = await db.session.findMany({
    where: { userId, revokedAt: null, absoluteExpiresAt: { gt: now } },
    orderBy: { createdAt: 'asc' },
  });

  if (existing.length >= MAX_CONCURRENT) {
    const toRevoke = existing.slice(0, existing.length - MAX_CONCURRENT + 1);
    await db.session.updateMany({
      where: { id: { in: toRevoke.map((s) => s.id) } },
      data: { revokedAt: now, revokedReason: 'max_concurrent_exceeded' },
    });
  }

  await db.session.create({
    data: {
      userId,
      tokenHash,
      ipHash: meta.ip ? hashIp(meta.ip) : null,
      userAgent: meta.userAgent?.slice(0, 512) ?? null,
      country: meta.country ?? null,
      expiresAt,
      absoluteExpiresAt,
    },
  });

  logger.info({ userId, event: 'session_created' }, 'Session created');
  return raw;
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export async function verifySession(
  raw: string,
): Promise<ActiveSession | null> {
  const tokenHash = hashToken(raw);
  const now = new Date();

  const session = await db.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
      absoluteExpiresAt: { gt: now },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          mfaEnrolled: true,
        },
      },
    },
  });

  if (!session || !session.user.isActive) {
    return null;
  }

  // Slide the idle expiry
  await db.session.update({
    where: { id: session.id },
    data: { lastActiveAt: now, expiresAt: new Date(now.getTime() + IDLE_TTL_MS) },
  });

  return {
    sessionId: session.id,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      mfaEnrolled: session.user.mfaEnrolled,
    },
    country: session.country,
  };
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export async function setSessionCookie(raw: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ABSOLUTE_TTL_MS / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getSessionFromCookie(): Promise<ActiveSession | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifySession(raw);
}

// ─── Revoke ───────────────────────────────────────────────────────────────────

export async function revokeSession(
  sessionId: string,
  reason?: string,
): Promise<void> {
  await db.session.update({
    where: { id: sessionId },
    data: { revokedAt: new Date(), revokedReason: reason ?? 'manual_revoke' },
  });
}

export async function revokeAllUserSessions(
  userId: string,
  reason?: string,
): Promise<void> {
  await db.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date(), revokedReason: reason ?? 'revoke_all' },
  });
}

// ─── Fresh auth check ─────────────────────────────────────────────────────────

/**
 * Returns true if the session was authenticated (i.e. login occurred)
 * within the last `maxAgeSeconds` seconds.
 * Use before sensitive operations: role changes, MFA reset, data export, etc.
 */
export async function isRecentlyAuthenticated(
  sessionId: string,
  maxAgeSeconds = 300,
): Promise<boolean> {
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return false;
  const ageMs = Date.now() - session.createdAt.getTime();
  return ageMs < maxAgeSeconds * 1000;
}

// ─── Unused token comparison (for invitation tokens etc.) ─────────────────────

export function safeEqual(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}
