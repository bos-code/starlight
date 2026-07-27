// packages/security/anomaly.ts
// Handles anomaly detection based on events generated over time.

import { db } from '../db';
import { SecurityEventType, recordSecurityEvent } from './events';
import { logger } from '../logger';

export async function detectLoginAnomalies(userId: string, currentIpHash: string, currentCountry: string | null) {
  // Check if the user is logging in from a new country
  if (currentCountry) {
    const recentLogins = await db.session.findMany({
      where: {
        userId,
        country: { not: null },
      },
      distinct: ['country'],
      select: { country: true },
    });

    const knownCountries = new Set(recentLogins.map(l => l.country));
    
    if (knownCountries.size > 0 && !knownCountries.has(currentCountry)) {
      recordSecurityEvent({
        type: SecurityEventType.AUTH_NEW_COUNTRY,
        severity: 'MEDIUM',
        actorUserId: userId,
        ipHash: currentIpHash,
        country: currentCountry,
        action: 'LOGIN',
        metadata: { knownCountries: Array.from(knownCountries) },
      });
      logger.warn({ userId, currentCountry }, 'Login from new country detected');
    }
  }
}
