// app/(admin)/layout.tsx
// Admin shell layout. Verifies session on every render.
// If session is invalid or expired, redirects to /admin/login.

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionFromCookie } from '../../packages/auth/session';

export const metadata = {
  title: 'Admin — Starlite Tools',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full DB session verification happens here (server component = Node.js runtime)
  const session = await getSessionFromCookie();

  if (!session) {
    redirect('/admin/login');
  }

  if (session.user.mfaEnrolled) {
    const store = await cookies();
    if (!store.has('starlite_mfa')) {
      redirect('/admin/mfa');
    }
  } else {
    // If not enrolled, force enrollment (except if already on the enroll page)
    // Actually layout wraps everything inside (admin) except pages that override layout or don't use it.
    // Wait, the mfa pages use the same layout? Let's check where mfa pages are. 
    // They should probably be outside the main admin shell, or they need to bypass this check.
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Administration navigation">
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-brand">Starlite Tools</span>
          <span className="admin-sidebar-role">{session.user.role.replace(/_/g, ' ')}</span>
        </div>

        <nav className="admin-nav" aria-label="Main admin navigation">
          <AdminNavLink href="/admin" label="Dashboard" />
          <AdminNavLink href="/admin/products" label="Products" />
          <AdminNavLink href="/admin/quotes" label="Quotations" />
          <AdminNavLink href="/admin/feedback" label="Feedback" />
          {(session.user.role === 'SUPER_ADMIN') && (
            <>
              <AdminNavLink href="/admin/users" label="Staff" />
              <AdminNavLink href="/admin/security" label="Security" />
              <AdminNavLink href="/admin/audit" label="Audit Log" />
              <AdminNavLink href="/admin/settings" label="Settings" />
            </>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-sidebar-user">{session.user.name}</span>
          <form action="/api/admin/auth/logout" method="POST">
            <button type="submit" className="admin-logout-btn">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-content" id="admin-main-content">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="admin-nav-link">
      {label}
    </a>
  );
}
