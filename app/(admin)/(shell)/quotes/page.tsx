// app/(admin)/quotes/page.tsx
// Sales Admin quote management. Shows all quotes with status filtering.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { can } from '../../../packages/auth/permissions';
import { adminGetQuotes } from '../../../packages/quotes/quotes.dal';
import type { QuoteStatus } from '@prisma/client';

export const metadata = { title: 'Quotations — Starlite Admin' };
export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  UNDER_REVIEW: 'Under Review',
  CONTACTED: 'Contacted',
  PRICING: 'Pricing',
  QUOTE_SENT: 'Quote Sent',
  NEGOTIATING: 'Negotiating',
  APPROVED: 'Approved',
  WON: 'Won',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'quotes:read')) redirect('/admin');

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const result = await adminGetQuotes({
    status: params.status as QuoteStatus | undefined,
    search: params.search,
    page,
    limit: 25,
  });

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Quotations</h1>
        <p className="admin-page-subtitle">{result.total.toLocaleString()} total</p>
      </header>

      {/* Filter / search bar */}
      <form method="GET" className="admin-filter-bar" aria-label="Filter quotations">
        <input
          type="search"
          name="search"
          defaultValue={params.search ?? ''}
          placeholder="Search by reference, name, or phone…"
          className="admin-search-input"
          maxLength={100}
        />
        <select name="status" defaultValue={params.status ?? ''} className="admin-select">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {/* Status quick-filter tabs */}
      <nav className="admin-status-tabs" aria-label="Quote status filter">
        <a href="/admin/quotes?status=NEW" className={`admin-status-tab${params.status === 'NEW' ? ' active' : ''}`}>New</a>
        <a href="/admin/quotes?status=CONTACTED" className={`admin-status-tab${params.status === 'CONTACTED' ? ' active' : ''}`}>Contacted</a>
        <a href="/admin/quotes?status=PRICING" className={`admin-status-tab${params.status === 'PRICING' ? ' active' : ''}`}>Pricing</a>
        <a href="/admin/quotes?status=QUOTE_SENT" className={`admin-status-tab${params.status === 'QUOTE_SENT' ? ' active' : ''}`}>Sent</a>
        <a href="/admin/quotes" className={`admin-status-tab${!params.status ? ' active' : ''}`}>All</a>
      </nav>

      <div className="admin-table-container">
        <table className="admin-table" aria-label="Quotation requests">
          <thead>
            <tr>
              <th scope="col">Reference</th>
              <th scope="col">Status</th>
              <th scope="col">Contact</th>
              <th scope="col">Type</th>
              <th scope="col">Items</th>
              <th scope="col">Received</th>
            </tr>
          </thead>
          <tbody>
            {result.quotes.map((quote) => (
              <tr key={quote.id}>
                <td>
                  <a href={`/admin/quotes/${quote.id}`} className="admin-table-link">
                    {quote.reference}
                  </a>
                </td>
                <td>
                  <span className={`badge badge--quote-${quote.status.toLowerCase()}`}>
                    {STATUS_LABELS[quote.status] ?? quote.status}
                  </span>
                </td>
                <td>
                  <div>{quote.contactName}</div>
                  {quote.businessName && (
                    <div className="admin-table-subtitle">{quote.businessName}</div>
                  )}
                </td>
                <td>{quote.buyerType.replace(/_/g, ' ')}</td>
                <td>{quote._count.items}</td>
                <td>
                  <time dateTime={quote.createdAt.toISOString()}>
                    {quote.createdAt.toLocaleDateString('en-ZA')}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Quotes pagination">
          {page > 1 && (
            <a href={`?page=${page - 1}&status=${params.status ?? ''}&search=${params.search ?? ''}`} className="admin-pagination-btn">
              ← Previous
            </a>
          )}
          <span className="admin-pagination-info">
            Page {page} of {result.totalPages}
          </span>
          {page < result.totalPages && (
            <a href={`?page=${page + 1}&status=${params.status ?? ''}&search=${params.search ?? ''}`} className="admin-pagination-btn">
              Next →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
