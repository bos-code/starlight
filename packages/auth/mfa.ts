// packages/auth/mfa.ts
// TOTP-based Multi-Factor Authentication using the otpauth library.
// TOTP secrets are encrypted at rest using AES-256-GCM.

import * as OTPAuth from 'otpauth';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
import { db } from '../db';
import { logger } from '../logger';

const ENCRYPTION_KEY_HEX = process.env.MFA_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY_HEX) {
  throw new Error('MFA_ENCRYPTION_KEY environment variable is not set');
}
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_HEX, 'hex');

const TOTP_ISSUER = 'Starlite Tools Admin';
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;
// Allow 1 step before/after to account for clock drift
const TOTP_WINDOW = 1;

// ─── Encryption helpers ───────────────────────────────────────────────────────

function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  // Store as: iv(hex):tag(hex):ciphertext(hex)
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decryptSecret(stored: string): string {
  const [ivHex, tagHex, ciphertextHex] = stored.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const ciphertext = Buffer.from(ciphertextHex, 'hex');
  const decipher = createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext).toString('utf8') + decipher.final('utf8');
}

// ─── TOTP Setup ───────────────────────────────────────────────────────────────

export interface TotpSetupResult {
  secret: string;      // raw base32 secret (shown to user during setup)
  otpauthUri: string;  // for QR code generation
}

export function generateTotpSetup(userEmail: string): TotpSetupResult {
  const totp = new OTPAuth.TOTP({
    issuer: TOTP_ISSUER,
    label: userEmail,
    algorithm: 'SHA1',
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: OTPAuth.Secret.fromRandom(20),
  });

  return {
    secret: totp.secret.base32,
    otpauthUri: totp.toString(),
  };
}

/**
 * Persists the TOTP secret after the user has confirmed their first code.
 * The secret is encrypted before storage.
 */
export async function enrollTotp(
  userId: string,
  rawSecret: string,
  verificationCode: string,
): Promise<{ success: boolean; error?: string }> {
  const valid = verifyTotpCode(rawSecret, verificationCode);
  if (!valid) {
    return { success: false, error: 'Invalid verification code' };
  }

  const encryptedSecret = encryptSecret(rawSecret);

  await db.$transaction([
    db.mfaCredential.upsert({
      where: { userId_type: { userId, type: 'totp' } },
      create: { userId, type: 'totp', encryptedSecret },
      update: { encryptedSecret },
    }),
    db.user.update({
      where: { id: userId },
      data: { mfaEnrolled: true },
    }),
  ]);

  logger.info({ userId }, 'TOTP enrolled');
  return { success: true };
}

/**
 * Verifies a TOTP code against the stored encrypted secret.
 * Returns false if the user has no TOTP credential.
 */
export async function verifyTotpForUser(
  userId: string,
  code: string,
): Promise<boolean> {
  const credential = await db.mfaCredential.findUnique({
    where: { userId_type: { userId, type: 'totp' } },
  });

  if (!credential) return false;

  const rawSecret = decryptSecret(credential.encryptedSecret);
  return verifyTotpCode(rawSecret, code);
}

function verifyTotpCode(rawSecret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    algorithm: 'SHA1',
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: OTPAuth.Secret.fromBase32(rawSecret),
  });

  const delta = totp.validate({ token: code, window: TOTP_WINDOW });
  return delta !== null;
}

// ─── Recovery Codes ────────────────────────────────────────────────────────────

const RECOVERY_CODE_COUNT = 10;

function generateCode(): string {
  // Format: XXXXX-XXXXX (10 alphanumeric chars, grouped)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = randomBytes(10);
  for (const byte of bytes) {
    code += chars[byte % chars.length];
  }
  return `${code.slice(0, 5)}-${code.slice(5)}`;
}

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/**
 * Generates and stores a fresh set of recovery codes for a user.
 * Returns the raw codes (shown once to the user — never retrievable again).
 */
export async function generateRecoveryCodes(userId: string): Promise<string[]> {
  const codes: string[] = [];
  const hashed: { userId: string; codeHash: string }[] = [];

  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const code = generateCode();
    codes.push(code);
    hashed.push({ userId, codeHash: hashCode(code) });
  }

  await db.$transaction([
    db.recoveryCode.deleteMany({ where: { userId } }),
    db.recoveryCode.createMany({ data: hashed }),
  ]);

  return codes;
}

/**
 * Attempts to use a recovery code. Marks it as used on success.
 * Returns false if invalid or already used.
 */
export async function useRecoveryCode(
  userId: string,
  rawCode: string,
): Promise<boolean> {
  const codeHash = hashCode(rawCode.toUpperCase().replace(/[^A-Z0-9]/g, ''));

  const record = await db.recoveryCode.findFirst({
    where: { userId, codeHash, usedAt: null },
  });

  if (!record) return false;

  await db.recoveryCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  logger.warn({ userId }, 'Recovery code used');
  return true;
}
