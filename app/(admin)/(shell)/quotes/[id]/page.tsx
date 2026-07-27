// app/(admin)/quotes/[id]/page.tsx
// Individual quote detail page with status management, internal notes, and pricing.

import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '../../../../packages/auth/session';
import { can } from '../../../../packages/auth/permissions';
import { adminGetQuoteById } from '../../../../packages/quotes/quotes.dal';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Quote ${id.slice(0, 8)} — Starlite Admin` };
}

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'quotes:read')) redirect('/admin');

  const { id } = await params;
  const quote = await adminGetQuoteById(id);
  if (!quote) notFound();

  const canPrice = can(session.user.role, 'quotes:price');
  const canChangeStatus = can(session.user.role, 'quotes:status');
  const canAddNote = can(session.user.role, 'quotes:note');

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1 className="admin-page-title">{quote.reference}</h1>
            <p className="admin-page-subtitle">
              {quote.contactName}
              {quote.businessName ? ` · ${quote.businessName}` : ''}
              {' · '}
              {quote.contactPhone}
            </p>
          </div>
          <span className={`badge badge--quote-${quote.status.toLowerCase()}`}>
            {quote.status.replace(/_/g, ' ')}
          </span>
        </div>
      </header>

      <div className="admin-detail-grid">
        {/* Quote items */}
        <section className="admin-section" aria-labelledby="items-heading">
          <h2 id="items-heading" className="admin-section-title">Items</h2>
          <table className="admin-table" aria-label="Quote line items">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">SKU</th>
                <th scope="col">Qty</th>
                {canPrice && <th scope="col">Unit Price</th>}
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td><code>{item.product.sku ?? '—'}</code></td>
                  <td>{item.quantity}</td>
                  {canPrice && (
                    <td>
                      {item.unitPrice
                        ? `${item.currency ?? 'ZAR'} ${item.unitPrice}`
                        : <em className="admin-pending">Pending</em>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="admin-quote-total-notice">
            QUOTE TOTAL: PENDING SALES REVIEW
          </p>
        </section>

        {/* Buyer details */}
        <section className="admin-section" aria-labelledby="buyer-heading">
          <h2 id="buyer-heading" className="admin-section-title">Buyer Details</h2>
          <dl className="admin-detail-list">
            <dt>Type</dt><dd>{quote.buyerType.replace(/_/g, ' ')}</dd>
            <dt>Name</dt><dd>{quote.contactName}</dd>
            {quote.contactEmail && <><dt>Email</dt><dd>{quote.contactEmail}</dd></>}
            <dt>Phone</dt><dd>{quote.contactPhone}</dd>
            {quote.businessName && <><dt>Business</dt><dd>{quote.businessName}</dd></>}
            {quote.deliveryLocation && <><dt>Location</dt><dd>{quote.deliveryLocation}</dd></>}
            {quote.isCollection && <><dt>Collection</dt><dd>Yes — customer will collect</dd></>}
            {quote.requiredByDate && <><dt>Required by</dt><dd>{quote.requiredByDate.toLocaleDateString('en-ZA')}</dd></>}
            {quote.notes && <><dt>Notes</dt><dd>{quote.notes}</dd></>}
          </dl>
        </section>

        {/* Attachments */}
        {quote.attachments.length > 0 && (
          <section className="admin-section" aria-labelledby="attach-heading">
            <h2 id="attach-heading" className="admin-section-title">Attachments</h2>
            <ul className="admin-attachment-list">
              {quote.attachments.map((att) => (
                <li key={att.id} className="admin-attachment-item">
                  <span className="admin-attachment-name">{att.originalName}</span>
                  <span className={`badge badge--${att.fileStatus.toLowerCase()}`}>
                    {att.fileStatus}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Status History */}
        <section className="admin-section" aria-labelledby="history-heading">
          <h2 id="history-heading" className="admin-section-title">Status History</h2>
          <ol className="admin-timeline">
            {quote.statusHistory.map((h) => (
              <li key={h.id} className="admin-timeline-item">
                <time dateTime={h.changedAt.toISOString()}>
                  {h.changedAt.toLocaleString('en-ZA')}
                </time>
                <span>
                  {h.fromStatus ? `${h.fromStatus} → ` : ''}
                  <strong>{h.toStatus}</strong>
                </span>
                {h.reason && <em>{h.reason}</em>}
              </li>
            ))}
          </ol>
        </section>

        {/* Internal Notes */}
        <section className="admin-section" aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="admin-section-title">Internal Notes</h2>
          {quote.internalNotes.map((note) => (
            <div key={note.id} className="admin-note">
              <p className="admin-note-content">{note.content}</p>
              <time dateTime={note.createdAt.toISOString()}>
                {note.createdAt.toLocaleString('en-ZA')}
              </time>
            </div>
          ))}

          {canAddNote && (
            <form action={`/api/admin/quotes/${quote.id}/notes`} method="POST" className="admin-note-form">
              <label htmlFor="note-content" className="form-label">Add internal note</label>
              <textarea
                id="note-content"
                name="content"
                rows={3}
                maxLength={2000}
                className="form-textarea"
                required
              />
              <button type="submit" className="btn-primary">Add Note</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
