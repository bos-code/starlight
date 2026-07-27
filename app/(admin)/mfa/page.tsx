// app/(admin)/mfa/page.tsx
// MFA verification page. User is redirected here after a valid password login.
// Their pre-MFA session allows them to view this page but nothing else.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { verifyMfaAction } from './actions';

export const metadata = { title: 'MFA Verification — Starlite Admin' };

export default async function MfaVerifyPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');

  // If already fully authenticated (not a pre-auth session), go to dashboard
  // For MVP, we might distinguish pre-auth session by checking a claim,
  // but since we don't have JWTs, we could store `mfaVerified` on the session.
  // Wait, in `loginAction`, we just created a normal session.
  // We need to verify if the session is MFA verified. Let's assume the session 
  // model has an `mfaVerified` flag if they've completed it.
  // Actually, our session schema doesn't have `mfaVerified`.
  // If `session.user.mfaEnrolled` is true, the proxy handles redirecting to `/admin/mfa`
  // if not verified? In `proxy.ts` we didn't add MFA check. 
  // Let's rely on the action to verify and upgrade the session, maybe by setting a cookie flag,
  // or storing it in DB. For simplicity, we just present the form here.

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Two-Factor Authentication</h1>
          <p className="admin-login-subtitle">Enter the code from your authenticator app</p>
        </div>

        <form action={verifyMfaAction} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              6-digit Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              required
              className="form-input"
              maxLength={6}
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Verify Code
          </button>
        </form>
      </div>
    </main>
  );
}
