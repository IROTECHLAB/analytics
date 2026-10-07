import Link from 'next/link';
import { ArrowLeft, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { requireUser } from '@/lib/auth/require-user';
import { listSites } from '@/lib/db/queries/sites';
import { Topbar } from '@/components/Topbar';

export const dynamic = 'force-dynamic';

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default async function SettingsPage() {
  const user = await requireUser();
  const sites = await listSites(user.id);

  return (
    <>
      <Topbar
        sites={sites}
        userInitials={initials(user.name, user.email)}
        userPicture={user.picture}
      />
      <main className="min-h-[calc(100vh-57px)] p-6 md:p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <div>
            <h1 className="text-2xl font-bold">Account &amp; settings</h1>
            <p className="text-sm text-text-muted mt-1">
              Signed in as {user.email}
            </p>
          </div>

          <section className="rounded-lg bg-bg-elevated border border-border p-5 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <SettingsIcon size={16} className="text-brand-500" />
              Account
            </h2>
            <div className="flex items-center gap-4">
              {user.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt="avatar"
                  className="w-14 h-14 rounded-full border border-border object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.name ?? '—'}</p>
                <p className="text-sm text-text-muted truncate">{user.email}</p>
                <p className="text-xs text-text-subtle font-mono mt-1 truncate">
                  {user.id}
                </p>
              </div>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </section>

          <section className="rounded-lg bg-bg-elevated border border-border p-5 space-y-4">
            <h2 className="font-semibold">Your sites ({sites.length})</h2>
            {sites.length === 0 ? (
              <p className="text-sm text-text-muted">No sites yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {sites.map((site) => (
                  <li
                    key={site.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{site.name}</p>
                      <p className="text-xs text-text-muted font-mono truncate">
                        {site.domain}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/sites/${site.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border-strong text-text-muted hover:text-text transition-colors"
                    >
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg bg-bg-elevated border border-border p-5 space-y-2">
            <h2 className="font-semibold">About</h2>
            <p className="text-sm text-text-muted">
              IROTECHLAB ANALYTICS — privacy-first, self-hostable web analytics.
            </p>
            <p className="text-xs text-text-subtle">
              Powered by IrotechLab Auth · Neon Postgres · Next.js on Netlify
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
