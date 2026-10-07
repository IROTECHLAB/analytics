import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Activity, ExternalLink } from 'lucide-react';
import { getSiteByShareToken } from '@/lib/db/queries/sites';
import { getAllStats } from '@/lib/db/queries/analytics';
import { ShareDashboardClient } from './client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shared dashboard — IROTECHLAB ANALYTICS',
  robots: { index: false, follow: false },
};

export default async function SharePage({
  params,
}: {
  params: { token: string };
}) {
  const site = await getSiteByShareToken(params.token);
  if (!site) notFound();

  const stats = await getAllStats(site.id, '7d');

  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 md:px-6 py-4">
          <Link href="/" className="font-bold text-sm flex items-center gap-2">
            <Activity size={16} className="text-brand-500" />
            <span className="hidden sm:inline">IROTECHLAB</span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              ANALYTICS
            </span>
          </Link>
          <span className="text-xs text-text-subtle px-3 py-1 rounded-full border border-border">
            Shared dashboard
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="text-sm text-text-muted font-mono inline-flex items-center gap-2">
            {site.domain}
            <a
              href={`https://${site.domain}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-text-subtle hover:text-brand-400"
            >
              <ExternalLink size={14} />
            </a>
          </p>
        </div>

        <ShareDashboardClient token={params.token} initial={stats} />
      </div>
    </main>
  );
}
