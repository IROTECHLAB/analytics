import Link from 'next/link';
import {
  Plus,
  Activity,
  Sparkles,
  Send,
  Instagram,
  Globe,
  Zap,
  Crown,
} from 'lucide-react';
import { requireUser } from '@/lib/auth/require-user';
import { listSites } from '@/lib/db/queries/sites';
import { countEventsThisMonthForSite } from '@/lib/db/queries/usage';
import { effectivePlan, daysRemaining, UPGRADE_CONTACTS } from '@/lib/plans';
import { SiteCard } from '@/components/SiteCard';
import { Topbar } from '@/components/Topbar';

export const dynamic = 'force-dynamic';

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function sitesGridClass(count: number): string {
  // Mobile: always full width
  // Desktop: adaptive based on count
  if (count === 1) return 'grid grid-cols-1 gap-4';
  if (count === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4';
  return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
}

export default async function DashboardPage() {
  const user = await requireUser();
  const sites = await listSites(user.id);
  const plan = effectivePlan(user.plan, user.planExpiresAt);
  const days = daysRemaining(user.planExpiresAt);

  const usageCounts = await Promise.all(
    sites.map((s) => countEventsThisMonthForSite(s.id))
  );
  const totalEvents = usageCounts.reduce((a, b) => a + b, 0);
  const atSiteLimit = sites.length >= plan.maxSites;
  const isPro = plan.id === 'pro';
  const isSelfHost = plan.id === 'self-host';
  const showUpgrade = !isPro && !isSelfHost;

  return (
    <>
      <Topbar
        sites={sites}
        userInitials={initials(user.name, user.email)}
        userPicture={user.picture}
      />
      <main className="py-6 md:py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6 md:space-y-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatBlock
              icon={<Globe size={16} />}
              label="Sites"
              value={
                Number.isFinite(plan.maxSites)
                  ? `${sites.length} / ${plan.maxSites}`
                  : `${sites.length}`
              }
            />
            <StatBlock
              icon={<Zap size={16} />}
              label="Events this month"
              value={
                isSelfHost || isPro
                  ? totalEvents.toLocaleString()
                  : `${totalEvents.toLocaleString()} / ${plan.maxEventsPerMonth.toLocaleString()}`
              }
            />
            <StatBlock
              icon={<Crown size={16} />}
              label="Plan"
              value={plan.name}
              accent
            />
            <StatBlock
              icon={<Activity size={16} />}
              label={isPro && days !== null ? 'Days remaining' : 'Status'}
              value={
                isPro && days !== null
                  ? `${days}`
                  : isSelfHost
                  ? 'Unlimited'
                  : 'Free'
              }
            />
          </div>

          {/* Upgrade banner (only on Free) */}
          {showUpgrade && (
            <div className="rounded-lg bg-bg-elevated border border-brand-500/30 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-brand-500" />
                  <span className="font-semibold text-sm">
                    Unlock more with Pro
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  10 sites, 1M events/mo, 1-year retention — ₹
                  {UPGRADE_CONTACTS.priceINR} for{' '}
                  {UPGRADE_CONTACTS.periodDays} days
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={UPGRADE_CONTACTS.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all whitespace-nowrap"
                  style={{ backgroundImage: 'var(--brand-gradient)' }}
                >
                  <Send size={14} />
                  Telegram
                </a>
                <a
                  href={UPGRADE_CONTACTS.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border-strong text-text-muted hover:text-text transition-colors"
                  title="Contact on Instagram"
                >
                  <Instagram size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Sites header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Your sites</h1>
              <p className="text-sm text-text-muted mt-0.5">
                {sites.length === 0
                  ? 'Add your first site to start tracking.'
                  : `${sites.length} site${sites.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {atSiteLimit && showUpgrade ? (
              <a
                href={UPGRADE_CONTACTS.telegramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all whitespace-nowrap"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                <Sparkles size={16} />
                Upgrade for more
              </a>
            ) : (
              <Link
                href="/dashboard/sites/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px whitespace-nowrap"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                <Plus size={16} />
                Add site
              </Link>
            )}
          </div>

          {/* Sites — adaptive grid based on count */}
          {sites.length === 0 ? (
            <div className="rounded-lg bg-bg-elevated border border-dashed border-border-strong p-12 md:p-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-bg-overlay border border-border flex items-center justify-center text-text-subtle">
                <Activity size={24} />
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold text-lg">No sites yet</h2>
                <p className="text-sm text-text-muted max-w-md mx-auto">
                  Add your first website to get a tracking snippet. Paste it
                  into your site and watch visitors appear in real time.
                </p>
              </div>
              <Link
                href="/dashboard/sites/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                <Plus size={16} />
                Add your first site
              </Link>
            </div>
          ) : (
            <div className={sitesGridClass(sites.length)}>
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function StatBlock({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider text-text-subtle font-semibold truncate">
          {label}
        </span>
        <span className="text-brand-500 flex-shrink-0">{icon}</span>
      </div>
      <div
        className={`text-2xl md:text-3xl font-bold tnum ${
          accent ? 'text-brand-400' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}
