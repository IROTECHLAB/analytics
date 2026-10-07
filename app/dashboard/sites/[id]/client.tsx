'use client';

import { useState } from 'react';
import {
  Users,
  Eye,
  MousePointerClick,
  Timer,
  RefreshCw,
  LogIn,
  LogOut,
  Tag,
  Languages,
  MonitorSmartphone,
} from 'lucide-react';
import { StatCard } from '@/components/analytics/StatCard';
import { TimeSeriesChart } from '@/components/analytics/TimeSeriesChart';
import { BreakdownList } from '@/components/analytics/BreakdownList';
import { RealtimeCard } from '@/components/analytics/RealtimeCard';
import { CustomEventsList } from '@/components/analytics/CustomEventsList';
import { ExportButton } from '@/components/analytics/ExportButton';
import { DateRangePicker, type Range } from '@/components/analytics/DateRangePicker';
import type { StatsResponse } from '@/lib/db/queries/analytics';

function formatDuration(seconds: number): string {
  if (!seconds) return '0s';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function SiteAnalyticsView({
  siteId,
  initial,
}: {
  siteId: string;
  initial: StatsResponse;
}) {
  const [range, setRange] = useState<Range>(initial.range);
  const [stats, setStats] = useState<StatsResponse>(initial);
  const [loading, setLoading] = useState(false);

  async function fetchStats(next: Range) {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/stats?range=${next}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = (await res.json()) as StatsResponse;
        setStats(json);
      }
    } finally {
      setLoading(false);
    }
  }

  async function changeRange(next: Range) {
    setRange(next);
    await fetchStats(next);
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <DateRangePicker value={range} onChange={changeRange} />
        <div className="flex items-center gap-2">
          <ExportButton siteId={siteId} range={range} />
          <button
            type="button"
            onClick={() => fetchStats(range)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Visitors" value={stats.overview.visitors.toLocaleString()} Icon={Users} />
        <StatCard label="Pageviews" value={stats.overview.pageviews.toLocaleString()} Icon={Eye} />
        <StatCard label="Bounce rate" value={`${stats.overview.bounceRate}%`} Icon={MousePointerClick} />
        <StatCard label="Avg. duration" value={formatDuration(stats.overview.avgDuration)} Icon={Timer} />
      </div>

      {/* Realtime */}
      <RealtimeCard siteId={siteId} initial={stats.realtime} />

      {/* Traffic chart */}
      <div className="rounded-lg bg-bg-elevated border border-border p-5">
        <h3 className="font-semibold text-sm mb-4">Traffic</h3>
        <TimeSeriesChart data={stats.timeSeries} bucket={stats.bucket} />
      </div>

      {/* Custom events */}
      <CustomEventsList events={stats.customEvents} />

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BreakdownList
          title="Top pages"
          items={stats.topPages.map((r) => ({ label: r.path ?? '/', count: r.count }))}
        />
        <BreakdownList
          title="Top referrers"
          items={stats.topReferrers.map((r) => ({
            label: r.referrer ?? 'Direct',
            count: r.count,
          }))}
          emptyLabel="No referrers yet"
        />
        <BreakdownList
          title="Entry pages"
          items={stats.entryPages.map((r) => ({ label: r.page ?? '/', count: r.count }))}
        />
        <BreakdownList
          title="Exit pages"
          items={stats.exitPages.map((r) => ({ label: r.page ?? '/', count: r.count }))}
        />
        <BreakdownList
          title="Countries"
          items={stats.countries.map((r) => ({ label: r.country ?? 'Unknown', count: r.count }))}
        />
        <BreakdownList
          title="Devices"
          items={stats.devices.map((r) => ({ label: r.device ?? 'Unknown', count: r.count }))}
        />
        <BreakdownList
          title="Browsers"
          items={stats.browsers.map((r) => ({ label: r.browser ?? 'Unknown', count: r.count }))}
        />
        <BreakdownList
          title="Operating systems"
          items={stats.os.map((r) => ({ label: r.os ?? 'Unknown', count: r.count }))}
        />
        {stats.screens.length > 0 && (
          <BreakdownList
            title="Screen sizes"
            items={stats.screens.map((r) => ({ label: r.screen ?? 'Unknown', count: r.count }))}
          />
        )}
        {stats.languages.length > 0 && (
          <BreakdownList
            title="Languages"
            items={stats.languages.map((r) => ({ label: r.language ?? 'Unknown', count: r.count }))}
          />
        )}
        {stats.utmSources.length > 0 && (
          <BreakdownList
            title="Campaigns (UTM)"
            items={stats.utmSources.map((r) => ({
              label: `${r.source ?? '?'} / ${r.medium ?? '?'} / ${r.campaign ?? '?'}`,
              count: r.count,
            }))}
          />
        )}
      </div>
    </div>
  );
}
