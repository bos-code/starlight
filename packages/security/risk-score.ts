// packages/security/risk-score.ts
// Calculates a combined risk score for an event based on IP reputation,
// user behavior, and contextual anomalies.

export interface RiskContext {
  userId?: string;
  ipHash?: string;
  country?: string;
  userAgent?: string;
  action: string;
}

export function calculateRiskScore(
  baseSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  context: RiskContext,
): number {
  let score = 0;

  switch (baseSeverity) {
    case 'LOW':
      score += 15;
      break;
    case 'MEDIUM':
      score += 45;
      break;
    case 'HIGH':
      score += 75;
      break;
    case 'CRITICAL':
      score += 95;
      break;
  }

  // Adjust based on country (e.g. if we have a high-risk country list)
  // For MVP, we just flag missing/unknown countries slightly higher.
  if (!context.country || context.country === 'unknown') {
    score += 5;
  }

  // Adjust based on user agent (e.g. automated tools)
  if (context.userAgent && /python|curl|wget|bot/i.test(context.userAgent)) {
    score += 20;
  }

  // Max score is 100
  return Math.min(100, Math.max(0, score));
}
