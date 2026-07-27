// app/(admin)/mfa/enroll/page.tsx
// MFA enrolment page. All staff are forced to enrol TOTP MFA upon first login.
// This page generates the QR code via SimpleWebAuthn or qrcode (server side).

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../../packages/auth/session';
import { generateTotpSetup } from '../../../../packages/auth/mfa';
import { enrollMfaAction } from './actions';
import QRCode from 'qrcode';

export const metadata = { title: 'Set Up MFA — Starlite Admin' };

export default async function MfaEnrollmentPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');

  // If already enrolled, they shouldn't be here
  if (session.user.mfaEnrolled) {
    redirect('/admin');
  }

  // Generate a fresh TOTP secret (in memory, not yet saved)
  const setup = generateTotpSetup(session.user.email);
  const qrDataUrl = await QRCode.toDataURL(setup.otpauthUri, {
    width: 256,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card admin-login-card--wide">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Protect Your Account</h1>
          <p className="admin-login-subtitle">
            Set up Two-Factor Authentication (Required)
          </p>
        </div>

        <div className="mfa-enroll-grid">
          <div className="mfa-enroll-instructions">
            <ol className="mfa-steps">
              <li>Download an authenticator app (like Google Authenticator, Authy, or 1Password).</li>
              <li>Scan the QR code with your app.</li>
              <li>Enter the 6-digit verification code below.</li>
            </ol>
            
            <details className="mfa-manual-entry">
              <summary>Can't scan the QR code?</summary>
              <div className="mfa-manual-secret">
                <p>Enter this secret key manually into your app:</p>
                <code>{setup.secret}</code>
              </div>
            </details>
          </div>

          <div className="mfa-qr-container">
            <img src={qrDataUrl} alt="MFA QR Code" width={256} height={256} className="mfa-qr-image" />
          </div>
        </div>

        <form action={enrollMfaAction} className="admin-login-form">
          {/* We must pass the raw secret so the server knows what they are verifying against.
              Once verified, the server will encrypt and persist this secret. */}
          <input type="hidden" name="rawSecret" value={setup.secret} />

          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Verification Code
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
            Complete Setup
          </button>
        </form>
      </div>
    </main>
  );
}
