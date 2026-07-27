'use client';

// app/(admin)/login/page.tsx
// Staff login page. No public registration exists.
// Generic error messages prevent user enumeration.

import { useActionState } from 'react';
import { loginAction } from './actions';

const initialState = { error: null as string | null };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="admin-login-shell">
      <div className="admin-login-card">
        {/* Logo / Brand */}
        <div className="admin-login-header">
          <div className="admin-login-logo" aria-hidden="true">ST</div>
          <h1 className="admin-login-title">Starlite Tools</h1>
          <p className="admin-login-subtitle">Staff Portal</p>
        </div>

        <form action={formAction} className="admin-login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              disabled={isPending}
            />
          </div>

          {state?.error && (
            <div
              role="alert"
              aria-live="assertive"
              className="form-error-banner"
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="admin-login-security-notice">
          Starlite staff will never ask for your password through email or
          WhatsApp.
        </p>
      </div>
    </main>
  );
}
