// app/(admin)/(shell)/users/page.tsx
// Staff Management Page. Super Admin only.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../../../packages/auth/session';
import { can } from '../../../../../packages/auth/permissions';
import { db } from '../../../../../packages/db';

export const metadata = { title: 'Staff — Starlite Admin' };
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'staff:read')) redirect('/admin');

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      mfaEnrolled: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Staff Management</h1>
        <div className="admin-page-actions">
          {can(session.user.role, 'staff:create') && (
            <a href="/admin/users/invite" className="btn-primary">
              Invite Staff
            </a>
          )}
        </div>
      </header>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Staff members">
          <thead>
            <tr>
              <th scope="col">Name & Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">MFA</th>
              <th scope="col">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={!u.isActive ? 'admin-table-row--disabled' : ''}>
                <td>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div className="admin-table-subtitle">{u.email}</div>
                </td>
                <td>{u.role.replace(/_/g, ' ')}</td>
                <td>
                  <span className={`badge badge--${u.isActive ? 'success' : 'critical'}`}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  {u.mfaEnrolled ? (
                    <span className="badge badge--success">Enrolled</span>
                  ) : (
                    <span className="badge badge--warning">Not Enrolled</span>
                  )}
                </td>
                <td>
                  {u.lastLoginAt ? (
                    <time dateTime={u.lastLoginAt.toISOString()}>
                      {u.lastLoginAt.toLocaleDateString('en-ZA')}
                    </time>
                  ) : (
                    'Never'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
