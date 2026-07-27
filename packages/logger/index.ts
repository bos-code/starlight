// packages/logger/index.ts
// Structured logger using pino.
// In development: pretty-printed output.
// In production: JSON lines for log aggregation.

import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  // Redact sensitive fields from all log output
  redact: {
    paths: [
      'password',
      'passwordHash',
      'sessionToken',
      'mfaSecret',
      'recoveryCode',
      '*.password',
      '*.passwordHash',
      '*.sessionToken',
      '*.mfaSecret',
      '*.recoveryCode',
      'authorization',
      'cookie',
      'set-cookie',
    ],
    censor: '[REDACTED]',
  },
});

/**
 * Creates a child logger bound to a specific request ID and optional context.
 * Use this inside Route Handlers and Server Actions to correlate log lines.
 */
export function requestLogger(requestId: string, context?: Record<string, unknown>) {
  return logger.child({ requestId, ...context });
}

export type Logger = typeof logger;
