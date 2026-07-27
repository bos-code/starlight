// app/(admin)/security/page.tsx
// Security centre dashboard. Super Admin only.
// Shows recent security events, risk levels, and emergency controls.

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '../../../packages/auth/session';
import { can } from '../../../packages/auth/permissions';
import { db } from '../../../packages/db';

export const metadata = { title: 'Security Centre — Starlite Admin' };
export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'security:read')) redirect('/admin');

  const [recentEvents, openIncidents, criticalCount] = await Promise.all([
    db.securityEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: 25,
      where: { resolved: false },
      select: {
        id: true,
        type: true,
        severity: true,
        riskScore: true,
        country: true,
        occurredAt: true,
        actorUserId: true,
        action: true,
      },
    }),
    db.incident.findMany({
      where: { status: { in: ['OPEN', 'CONTAINED'] } },
      orderBy: { openedAt: 'desc' },
      take: 10,
    }),
    db.securityEvent.count({
      where: { severity: 'CRITICAL', resolved: false },
    }),
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Security Centre</h1>
        {criticalCount > 0 && (
          <div className="admin-alert admin-alert--critical" role="alert">
            ⚠ {criticalCount} unresolved critical event{criticalCount !== 1 ? 's' : ''}
          </div>
        )}
      </header>

      {/* Open Incidents */}
      <section className="admin-section" aria-labelledby="incidents-heading">
        <h2 id="incidents-heading" className="admin-section-title">
          Open Incidents ({openIncidents.length})
        </h2>
        {openIncidents.length === 0 ? (
          <p className="admin-empty-state">No open incidents.</p>
        ) : (
          <div className="admin-card-list">
            {openIncidents.map((incident) => (
              <div key={incident.id} className={`admin-incident-card admin-incident-card--${incident.severity.toLowerCase()}`}>
                <div className="admin-incident-header">
                  <span className="admin-incident-severity">{incident.severity}</span>
                  <span className="admin-incident-status">{incident.status}</span>
                </div>
                <h3 className="admin-incident-title">{incident.title}</h3>
                <time className="admin-incident-time" dateTime={incident.openedAt.toISOString()}>
                  Opened: {incident.openedAt.toLocaleString('en-ZA')}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Events */}
      <section className="admin-section" aria-labelledby="events-heading">
        <h2 id="events-heading" className="admin-section-title">
          Recent Unresolved Events
        </h2>
        <div className="admin-table-container">
          <table className="admin-table" aria-label="Security events">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Type</th>
                <th scope="col">Severity</th>
                <th scope="col">Risk</th>
                <th scope="col">Country</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <time dateTime={event.occurredAt.toISOString()}>
                      {event.occurredAt.toLocaleString('en-ZA')}
                    </time>
                  </td>
                  <td><code className="audit-action">{event.type}</code></td>
                  <td>
                    <span className={`badge badge--${event.severity.toLowerCase()}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td>{event.riskScore}</td>
                  <td>{event.country ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Emergency Controls — only shown to security:emergency role */}
      {can(session.user.role, 'security:emergency') && (
        <section className="admin-section admin-section--danger" aria-labelledby="emergency-heading">
          <h2 id="emergency-heading" className="admin-section-title">
            Emergency Controls
          </h2>
          <p className="admin-emergency-warning">
            These actions are irreversible during the session. All actions are
            logged and require confirmation.
          </p>
          <div className="admin-emergency-grid">
            <EmergencyControlButton
              label="Revoke All Sessions"
              href="/admin/security/emergency/revoke-sessions"
            />
            <EmergencyControlButton
              label="Disable Quote Submissions"
              href="/admin/security/emergency/disable-quotes"
            />
            <EmergencyControlButton
              label="Disable Uploads"
              href="/admin/security/emergency/disable-uploads"
            />
            <EmergencyControlButton
              label="Enable Read-Only Mode"
              href="/admin/security/emergency/readonly-mode"
            />
          </div>
        </section>
      )}
    </div>
  );
}

function EmergencyControlButton({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="admin-emergency-btn">
      {label}
    </a>
  );
}
