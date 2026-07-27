// proxy.ts
// Next.js 16: "middleware" has been renamed to "proxy".
// This file runs before every matched route and is responsible for:
//   1. Injecting a request ID for log correlation
//   2. Setting security response headers
//   3. Protecting admin routes with session verification
//   4. Redirecting unauthenticated admin visitors to /admin/login

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

// NOTE: proxy.ts cannot import from packages/ that use Node.js APIs like
// argon2 or Prisma because it runs in the Edge runtime.
// Session verification here is lightweight — only reading the cookie value.
// Full session verification (DB lookup) happens in the Route Handler / Server Action.

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_MFA_PATH = '/admin/mfa';
const SESSION_COOKIE = 'starlite_session';

export function proxy(request: NextRequest) {
  const requestId = randomUUID();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminAuthRoute =
    pathname === ADMIN_LOGIN_PATH ||
    pathname === ADMIN_MFA_PATH ||
    pathname.startsWith('/admin/invite/');

  // ── Admin route protection ──────────────────────────────────
  if (isAdminRoute && !isAdminAuthRoute) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    if (!sessionCookie?.value) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Full DB session verification is done inside the admin layout / DAL.
    // Here we only check that a cookie exists, to avoid Edge runtime constraints.
  }

  // ── Build the response ──────────────────────────────────────
  const response = NextResponse.next({
    request: {
      headers: new Headers({
        ...Object.fromEntries(request.headers),
        'x-request-id': requestId,
        'x-forwarded-for':
          request.headers.get('x-forwarded-for') ??
          'unknown',
      }),
    },
  });

  // ── Security headers ────────────────────────────────────────
  response.headers.set('X-Request-Id', requestId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    );
  }

  // Admin routes get stricter headers
  if (isAdminRoute) {
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
    );
  } else {
    const r2Public = process.env.R2_PUBLIC_URL ?? '';
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        `img-src 'self' data: blob: ${r2Public}`,
        "font-src 'self' https://fonts.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "script-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ].join('; '),
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
