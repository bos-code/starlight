// packages/auth/invitations.ts
// Staff invitation flow.
// Super Admin creates an invitation → staff member receives an email with
// a one-time signed token → clicks link → sets password → enrolls MFA.

import { randomBytes, createHash } from 'crypto';
import { db } from '../db';
import { hashPassword, validatePasswordStrength, isPasswordBreached } from './password';
import type { Role } from '@prisma/client';

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 48;

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

// ─── Create ───────────────────────────────────────────────────────────────────

export interface CreateInvitationResult {
  token: string;    // raw — include in the invitation email link
  expiresAt: Date;
}

export async function createInvitation(
  email: string,
  role: Role,
  invitedById: string,
): Promise<CreateInvitationResult> {
  const raw = generateToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  // Invalidate any existing pending invitations for this email
  await db.staffInvitation.updateMany({
    where: { email, usedAt: null },
    data: { usedAt: new Date() }, // mark as consumed so they can't be reused
  });

  await db.staffInvitation.create({
    data: { email, role, tokenHash, invitedById, expiresAt },
  });

  return { token: raw, expiresAt };
}

// ─── Validate ─────────────────────────────────────────────────────────────────

export interface InvitationValidationResult {
  valid: boolean;
  invitation?: { id: string; email: string; role: Role };
  error?: string;
}

export async function validateInvitationToken(
  raw: string,
): Promise<InvitationValidationResult> {
  const tokenHash = hashToken(raw);
  const now = new Date();

  const invitation = await db.staffInvitation.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
  });

  if (!invitation) {
    return { valid: false, error: 'Invitation not found or has expired.' };
  }

  return {
    valid: true,
    invitation: { id: invitation.id, email: invitation.email, role: invitation.role },
  };
}

// ─── Accept ───────────────────────────────────────────────────────────────────

export interface AcceptInvitationInput {
  token: string;
  name: string;
  password: string;
}

export interface AcceptInvitationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export async function acceptInvitation(
  input: AcceptInvitationInput,
): Promise<AcceptInvitationResult> {
  const validation = await validateInvitationToken(input.token);
  if (!validation.valid || !validation.invitation) {
    return { success: false, error: validation.error };
  }

  const strengthErrors = validatePasswordStrength(input.password);
  if (strengthErrors.length > 0) {
    return { success: false, error: strengthErrors[0] };
  }

  const breached = await isPasswordBreached(input.password);
  if (breached) {
    return {
      success: false,
      error:
        'This password has been found in a known data breach. Please choose a different password.',
    };
  }

  const passwordHash = await hashPassword(input.password);
  const { id, email, role } = validation.invitation;

  const user = await db.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        name: input.name,
        role,
        passwordHash,
        isActive: true,
        mfaEnrolled: false,
      },
    });

    await tx.staffInvitation.update({
      where: { id },
      data: { usedAt: new Date() },
    });

    return newUser;
  });

  return { success: true, userId: user.id };
}
