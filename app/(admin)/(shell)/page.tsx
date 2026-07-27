// app/(admin)/page.tsx
// Admin dashboard. Redirects to /admin/dashboard for now.
// Acts as the landing page after login.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../packages/auth/session';
import { db } from '../../packages/db';

export default async function AdminPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');

  // Fetch quick stats
  const [quoteCount, newQuoteCount, productCount] = await Promise.all([
    db.quote.count(),
    db.quote.count({ where: { status: 'NEW' } }),
    db.product.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Welcome back, {session.user.name}
        </p>
      </header>

      <section className="admin-stats-grid" aria-label="Key metrics">
        <StatCard label="New Quotes" value={newQuoteCount} highlight />
        <StatCard label="Total Quotes" value={quoteCount} />
        <StatCard label="Published Products" value={productCount} />
      </section>

      <section className="admin-quick-links" aria-label="Quick actions">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-links-grid">
          <a href="/admin/quotes?status=NEW" className="admin-quick-link">
            View new quote requests →
          </a>
          <a href="/admin/products/new" className="admin-quick-link">
            Add a new product →
          </a>
          <a href="/admin/feedback?status=SUBMITTED" className="admin-quick-link">
            Review feedback →
          </a>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`admin-stat-card${highlight ? ' admin-stat-card--highlight' : ''}`}>
      <span className="admin-stat-value">{value.toLocaleString()}</span>
      <span className="admin-stat-label">{label}</span>
    </div>
  );
}
