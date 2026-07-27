// packages/security/headers.ts
// Security response headers applied by proxy.ts to every response.
// Two sets: one for public routes, one for admin routes (stricter CSP).

export type HeaderMap = Record<string, string>;

/** Base headers applied to ALL routes */
export const BASE_SECURITY_HEADERS: HeaderMap = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

/** HSTS — only set in production */
export const HSTS_HEADER: HeaderMap =
  process.env.NODE_ENV === 'production'
    ? {
        'Strict-Transport-Security':
          'max-age=63072000; includeSubDomains; preload',
      }
    : {};

/**
 * Content Security Policy for the public website.
 * Allows loading from the R2 public CDN and any configured fonts.
 */
export function buildPublicCSP(): string {
  const r2Public = process.env.R2_PUBLIC_URL ?? '';
  const directives = [
    "default-src 'self'",
    `img-src 'self' data: blob: ${r2Public}`,
    `font-src 'self' https://fonts.gstatic.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "script-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ];
  return directives.join('; ');
}

/**
 * Content Security Policy for the admin application.
 * Significantly more restrictive — no external fonts, no unsafe-inline.
 */
export function buildAdminCSP(nonce?: string): string {
  const scriptSrc = nonce ? `'nonce-${nonce}'` : "'self'";
  const directives = [
    "default-src 'self'",
    `script-src 'self' ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ];
  return directives.join('; ');
}

/** Returns all headers to be applied to a public response */
export function publicResponseHeaders(): HeaderMap {
  return {
    ...BASE_SECURITY_HEADERS,
    ...HSTS_HEADER,
    'Content-Security-Policy': buildPublicCSP(),
  };
}

/** Returns all headers to be applied to an admin response */
export function adminResponseHeaders(nonce?: string): HeaderMap {
  return {
    ...BASE_SECURITY_HEADERS,
    ...HSTS_HEADER,
    'Content-Security-Policy': buildAdminCSP(nonce),
    'Cache-Control': 'no-store',
  };
}
