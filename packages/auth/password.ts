// packages/auth/password.ts
// Argon2id password hashing and verification.
// Uses the argon2 npm package (native bindings).
// Also provides optional HaveIBeenPwned breach check.

import argon2 from 'argon2';
import { createHash } from 'crypto';
import { logger } from '../logger';

// OWASP-recommended Argon2id parameters (2023)
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MiB
  timeCost: 3,
  parallelism: 4,
};

const MIN_PASSWORD_LENGTH = 12;

/**
 * Hashes a password with Argon2id.
 * Never store the raw password.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/**
 * Verifies a raw password against a stored hash.
 * Returns false (not throws) on mismatch.
 */
export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Validates password strength. Returns a list of violation messages.
 * Returns empty array if the password is acceptable.
 */
export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  // Not requiring character class diversity — length is the primary driver.
  // This is consistent with NIST SP 800-63B.
  return errors;
}

/**
 * Checks the password against the HaveIBeenPwned Passwords API
 * using the k-anonymity model (only the first 5 chars of the SHA-1 hash are sent).
 *
 * Returns true if the password has been found in a breach.
 * Returns false if it has not, or if the check cannot be completed.
 * Never throws — failure degrades gracefully.
 */
export async function isPasswordBreached(password: string): Promise<boolean> {
  const apiKey = process.env.HIBP_API_KEY;

  // Graceful degradation: if no API key, skip the check
  if (!apiKey) {
    logger.warn('HIBP_API_KEY not set — skipping breach check');
    return false;
  }

  try {
    const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'hibp-api-key': apiKey,
        'Add-Padding': 'true',
      },
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      logger.warn({ status: res.status }, 'HIBP API returned non-200 — skipping check');
      return false;
    }

    const text = await res.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hash, countStr] = line.trim().split(':');
      if (hash === suffix && parseInt(countStr, 10) > 0) {
        return true;
      }
    }

    return false;
  } catch (err) {
    logger.warn({ err }, 'HIBP check failed — skipping');
    return false;
  }
}
