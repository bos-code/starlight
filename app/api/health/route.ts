// app/api/health/route.ts
// Health check endpoint. Returns service status for uptime monitors.
// Does NOT expose sensitive internal information.

import { NextResponse } from 'next/server';
import { db } from '../../../packages/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  let dbStatus: 'ok' | 'error' = 'ok';
  let dbLatencyMs: number | null = null;

  try {
    const dbStart = Date.now();
    await db.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch {
    dbStatus = 'error';
  }

  const healthy = dbStatus === 'ok';

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      version: process.env.npm_package_version ?? 'unknown',
      uptime: process.uptime(),
      db: { status: dbStatus, latencyMs: dbLatencyMs },
      responseMs: Date.now() - start,
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
