// app/(admin)/audit/page.tsx
// Read-only audit log viewer. No edit, no delete.
// Only Super Admins can access this page.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { can } from '../../../packages/auth/permissions';
import { db } from '../../../packages/db';

export const metadata = { title: 'Audit Log — Starlite Admin' };
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; actor?: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'audit:read')) redirect('/admin');

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(params.action ? { action: params.action as any } : {}),
    ...(params.actor ? { actorId: params.actor } : {}),
  };

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: { actor: { select: { name: true, email: true } } },
    }),
    db.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Audit Log</h1>
        <p className="admin-page-subtitle">
          {total.toLocaleString()} records — read-only
        </p>
      </header>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Audit log entries">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Actor</th>
              <th scope="col">Action</th>
              <th scope="col">Resource</th>
              <th scope="col">Request ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <time dateTime={log.occurredAt.toISOString()}>
                    {log.occurredAt.toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
                  </time>
                </td>
                <td>{log.actor?.name ?? 'System'}</td>
                <td>
                  <code className="audit-action">{log.action}</code>
                </td>
                <td>
                  {log.resourceType}
                  {log.resourceId && (
                    <span className="audit-resource-id"> {log.resourceId.slice(0, 8)}…</span>
                  )}
                </td>
                <td>
                  <code className="audit-request-id">
                    {log.requestId?.slice(0, 8) ?? '—'}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Audit log pagination">
          {page > 1 && (
            <a href={`?page=${page - 1}`} className="admin-pagination-btn">
              ← Previous
            </a>
          )}
          <span className="admin-pagination-info">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a href={`?page=${page + 1}`} className="admin-pagination-btn">
              Next →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
