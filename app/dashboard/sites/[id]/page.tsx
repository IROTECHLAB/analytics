import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { requireUser } from '@/lib/auth/require-user';
import { getSite, listSites } from '@/lib/db/queries/sites';
import { getAllStats } from '@/lib/db/queries/analytics';
import { config } from '@/lib/config';
import { CodeBlock } from '@/components/CodeBlock';
import { Topbar } from '@/components/Topbar';
import { SiteAnalyticsView } from './client';
import { ShareSettingsCard } from './share-card';

export const dynamic = 'force-dynamic';

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default async function SiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const site = await getSite(user.id, params.id);
  if (!site) notFound();

  const [stats, sites] = await Promise.all([
    getAllStats(site.id, '7d'),
    listSites(user.id),
  ]);

  const scriptUrl = `${config.appUrl}/script.js`;
  const snippet = `<script
  defer
  data-site="${site.publicKey}"
  src="${scriptUrl}"
></script>`;

  const hasAnyData = stats.overview.pageviews > 0;

  return (
    <>
      <Topbar
        sites={sites}
        currentSiteId={site.id}
        userInitials={initials(user.name, user.email)}
        userPicture={user.picture}
      />
      <main className="min-h-[calc(100vh-57px)] p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={16} />
            Back to sites
          </Link>

          <header className="space-y-2">
            <h1 className="text-2xl font-bold">{site.name}</h1>
            <p className="text-sm text-text-muted font-mono inline-flex items-center gap-2">
              {site.domain}
              <a
                href={`https://${site.domain}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-text-subtle hover:text-brand-400 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </p>
          </header>

          {hasAnyData ? (
            <>
              <SiteAnalyticsView siteId={site.id} initial={stats} />
              <ShareSettingsCard site={site} appUrl={config.appUrl} />
            </>
          ) : (
            <>
              <div className="rounded-lg bg-bg-elevated border border-dashed border-border-strong p-8 text-center space-y-2">
                <h2 className="font-semibold">Waiting for first visit</h2>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Paste the snippet below into your site&apos;s{' '}
                  <code className="text-brand-400">&lt;head&gt;</code>, then reload
                  your site. The first pageview will appear here in seconds.
                </p>
              </div>

              <section className="space-y-3">
                <h2 className="font-semibold">Tracking snippet</h2>
                <CodeBlock code={snippet} label="html" />
              </section>

              <section className="space-y-3">
                <h2 className="font-semibold">Site key</h2>
                <CodeBlock code={site.publicKey} label="key" />
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
