// prisma/seed.ts
// Seeds the first Super Admin account.
// Run via: npx prisma db seed
// NEVER run in production without ALLOW_SEED=true.

import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const db = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== 'true') {
    console.error(
      'ERROR: Seed is disabled in production. Set ALLOW_SEED=true to override.',
    );
    process.exit(1);
  }

  const email = process.env.SEED_SUPER_ADMIN_EMAIL;
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'ERROR: SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD must be set.',
    );
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('ERROR: Seed password must be at least 12 characters.');
    process.exit(1);
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Super Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const user = await db.user.create({
    data: {
      email,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      passwordHash,
      isActive: true,
      mfaEnrolled: false,
    },
  });

  await db.auditLog.create({
    data: {
      action: 'USER_CREATED',
      resourceType: 'User',
      resourceId: user.id,
      newValue: { email, role: 'SUPER_ADMIN', source: 'seed' },
    },
  });

  console.log(`✅ Super Admin created: ${email}`);
  console.log('⚠️  MFA is not yet enrolled. Sign in and enrol MFA immediately.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
