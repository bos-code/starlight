// app/(admin)/feedback/page.tsx
// Feedback triage page.
// Fraud/phishing reports automatically trigger a security event.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { can } from '../../../packages/auth/permissions';
import { db } from '../../../packages/db';

export const metadata = { title: 'Feedback — Starlite Admin' };
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 25;

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; type?: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'feedback:read')) redirect('/admin');

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(params.status ? { status: params.status as any } : {}),
    ...(params.type ? { type: params.type as any } : {}),
  };

  const [items, total] = await Promise.all([
    db.feedback.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        type: true,
        status: true,
        name: true,
        message: true,
        severity: true,
        createdAt: true,
        assignedTo: { select: { name: true } },
      },
    }),
    db.feedback.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Feedback</h1>
        <p className="admin-page-subtitle">{total.toLocaleString()} items</p>
      </header>

      {/* Filter bar */}
      <form method="GET" className="admin-filter-bar" aria-label="Filter feedback">
        <select name="type" defaultValue={params.type ?? ''} className="admin-select">
          <option value="">All types</option>
          <option value="FRAUD_OR_PHISHING_REPORT">Fraud / Phishing</option>
          <option value="WEBSITE_PROBLEM">Website Problem</option>
          <option value="PRODUCT_INFORMATION_CORRECTION">Product Correction</option>
          <option value="MISSING_PRODUCT_REQUEST">Missing Product</option>
          <option value="QUOTE_PROBLEM">Quote Problem</option>
          <option value="CUSTOMER_SERVICE_COMPLAINT">Complaint</option>
          <option value="FEATURE_SUGGESTION">Feature Suggestion</option>
          <option value="ACCESSIBILITY_PROBLEM">Accessibility</option>
        </select>
        <select name="status" defaultValue={params.status ?? ''} className="admin-select">
          <option value="">All statuses</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="TRIAGED">Triaged</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <button type="submit" className="btn-primary">Filter</button>
      </form>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Feedback items">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">From</th>
              <th scope="col">Message</th>
              <th scope="col">Received</th>
              <th scope="col">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={item.type === 'FRAUD_OR_PHISHING_REPORT' ? 'admin-table-row--urgent' : ''}
              >
                <td>
                  <span className={`badge badge--${item.type === 'FRAUD_OR_PHISHING_REPORT' ? 'critical' : 'default'}`}>
                    {item.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>{item.status.replace(/_/g, ' ')}</td>
                <td>{item.name ?? 'Anonymous'}</td>
                <td className="admin-table-cell--truncate">{item.message.slice(0, 80)}…</td>
                <td>
                  <time dateTime={item.createdAt.toISOString()}>
                    {item.createdAt.toLocaleDateString('en-ZA')}
                  </time>
                </td>
                <td>{item.assignedTo?.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Feedback pagination">
          {page > 1 && <a href={`?page=${page - 1}&type=${params.type ?? ''}&status=${params.status ?? ''}`} className="admin-pagination-btn">← Previous</a>}
          <span className="admin-pagination-info">Page {page} of {totalPages}</span>
          {page < totalPages && <a href={`?page=${page + 1}&type=${params.type ?? ''}&status=${params.status ?? ''}`} className="admin-pagination-btn">Next →</a>}
        </nav>
      )}
    </div>
  );
}
