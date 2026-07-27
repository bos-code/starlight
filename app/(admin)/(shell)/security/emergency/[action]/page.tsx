// app/(admin)/security/emergency/[action]/page.tsx
// Emergency action confirmation pages.
// Only accessible to users with security:emergency permission.

import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '../../../../../packages/auth/session';
import { can } from '../../../../../packages/auth/permissions';
import { executeEmergencyAction } from './actions';

export const dynamic = 'force-dynamic';

const VALID_ACTIONS: Record<string, { title: string; description: string; btn: string }> = {
  'revoke-sessions': {
    title: 'Revoke All Sessions',
    description: 'This will immediately sign out all users (including you) and require everyone to log in again. Use this if you suspect a widespread session compromise.',
    btn: 'Revoke All Sessions Now',
  },
  'disable-quotes': {
    title: 'Disable Quote Submissions',
    description: 'This will temporarily block all public quote submissions. Use this during a massive spam attack that rate-limiting is not catching.',
    btn: 'Disable Submissions',
  },
  'disable-uploads': {
    title: 'Disable Uploads',
    description: 'This will temporarily block all file uploads. Use this if you suspect the quarantine or malware scanning system is compromised.',
    btn: 'Disable Uploads',
  },
  'readonly-mode': {
    title: 'Enable Read-Only Mode',
    description: 'This will put the entire administrative system into read-only mode. No state changes will be permitted until manually lifted in the database.',
    btn: 'Enable Read-Only Mode',
  },
};

export default async function EmergencyActionPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const session = await getSessionFromCookie();
  if (!session) redirect('/admin/login');
  if (!can(session.user.role, 'security:emergency')) redirect('/admin');

  const { action } = await params;
  const config = VALID_ACTIONS[action];
  if (!config) notFound();

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title admin-text-critical">Confirm Emergency Action</h1>
      </header>

      <section className="admin-section admin-section--danger">
        <h2 className="admin-section-title">{config.title}</h2>
        <p className="admin-emergency-warning" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
          <strong>WARNING:</strong> {config.description}
        </p>

        <form action={executeEmergencyAction}>
          <input type="hidden" name="actionType" value={action} />
          
          <div className="form-group">
            <label htmlFor="reason" className="form-label">
              Reason for emergency action (will be logged in Audit and Security Event)
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              required
              className="form-textarea"
              placeholder="e.g. Suspected widespread session token theft"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn-primary btn-critical">
              {config.btn}
            </button>
            <a href="/admin/security" className="btn-secondary">
              Cancel
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}
