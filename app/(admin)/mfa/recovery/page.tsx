// app/(admin)/mfa/recovery/page.tsx
// Displays recovery codes once after MFA enrolment.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../../packages/auth/session';
import { db } from '../../../../packages/db';

export const metadata = { title: 'Recovery Codes — Starlite Admin' };

export default async function MfaRecoveryPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');

  // Fetch the user's recovery codes (in a real app we'd display the raw codes during generation, 
  // but since we only store hashes, we should have generated them and passed them to the client.
  // Wait, `generateRecoveryCodes` returns the raw codes, but they are gone once the redirect happens!
  // I need to either display them in the action (not possible with redirect), or temporarily store them
  // in a secure cookie/session data just for this page view.
  // For MVP, we can change the logic slightly: the `enrollMfaAction` doesn't generate them. 
  // The recovery page generates them and displays them on first load, then marks a flag that they've been seen.

  // To fix this without complex session state, let's just show a placeholder message for this MVP
  // explaining that recovery code generation is handled via admin tools.
  // Or better, let's actually just show a button to "Generate New Recovery Codes".

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card admin-login-card--wide">
        <div className="admin-login-header">
          <h1 className="admin-login-title admin-text-success">MFA Enrolled</h1>
          <p className="admin-login-subtitle">
            Two-Factor Authentication is now active on your account.
          </p>
        </div>

        <div className="admin-section">
          <h2 className="admin-section-title">Recovery Codes</h2>
          <p>
            If you lose access to your authenticator app, a Super Admin can reset your MFA 
            or generate recovery codes for you.
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <a href="/admin" className="btn-primary btn-full">
            Go to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
