// packages/db/index.ts
// Singleton Prisma client.
// In development, reuses a global instance to survive hot-reloads.
// In production, creates a single instance per process.

import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global var across hot-reloads in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
}

const db: PrismaClient = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db;
}

export { db };
