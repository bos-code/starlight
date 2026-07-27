// packages/security/rate-limit.ts
// DB-backed rate limiting (no Redis required).
// Uses PostgreSQL to track request counts per key within a time window.

import { db } from '../db';

export interface RateLimitConfig {
  /** Unique key prefix, e.g. "login", "quote", "presign" */
  prefix: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Checks and increments the rate limit for a given identifier (e.g. IP hash).
 * Uses an upsert within the current time window.
 */
export async function checkRateLimit(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
  const key = `${config.prefix}:${identifier}`;
  const now = new Date();
  const windowMs = config.windowSeconds * 1000;
  // Round down to the start of the current window
  const windowStart = new Date(
    Math.floor(now.getTime() / windowMs) * windowMs,
  );
  const windowEnd = new Date(windowStart.getTime() + windowMs);

  // Clean up expired windows periodically (10% of requests trigger cleanup)
  if (Math.random() < 0.1) {
    db.rateLimitEntry
      .deleteMany({ where: { windowEnd: { lt: now } } })
      .catch(() => {}); // fire and forget, non-blocking
  }

  try {
    const result = await db.$executeRaw`
      INSERT INTO rate_limit_entries (id, key, count, "windowEnd")
      VALUES (gen_random_uuid(), ${key}, 1, ${windowEnd})
      ON CONFLICT (key, "windowEnd")
      DO UPDATE SET count = rate_limit_entries.count + 1
      RETURNING count
    `;

    // Fetch the updated count
    const entry = await db.rateLimitEntry.findFirst({
      where: { key, windowEnd },
      select: { count: true },
    });

    const count = entry?.count ?? 1;
    const allowed = count <= config.limit;
    const remaining = Math.max(0, config.limit - count);

    return { allowed, remaining, resetAt: windowEnd };
  } catch {
    // On DB failure, fail open (allow the request) to avoid blocking legitimate users
    return { allowed: true, remaining: 0, resetAt: windowEnd };
  }
}

// ─── Preset configurations ────────────────────────────────────────────────────

export const RATE_LIMITS = {
  login: {
    prefix: 'login',
    limit: parseInt(process.env.RATE_LIMIT_LOGIN_PER_15MIN ?? '5', 10),
    windowSeconds: 15 * 60,
  },
  quote: {
    prefix: 'quote',
    limit: parseInt(process.env.RATE_LIMIT_QUOTE_PER_HOUR ?? '5', 10),
    windowSeconds: 60 * 60,
  },
  presign: {
    prefix: 'presign',
    limit: parseInt(process.env.RATE_LIMIT_UPLOAD_PRESIGN_PER_HOUR ?? '20', 10),
    windowSeconds: 60 * 60,
  },
  productSearch: {
    prefix: 'search',
    limit: 120,
    windowSeconds: 60,
  },
} satisfies Record<string, RateLimitConfig>;
