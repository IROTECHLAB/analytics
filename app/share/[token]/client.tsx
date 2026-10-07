'use client';

import { useState } from 'react';
import { Users, Eye, MousePointerClick, Timer } from 'lucide-react';
import { StatCard } from '@/components/analytics/StatCard';
import { TimeSeriesChart } from '@/components/analytics/TimeSeriesChart';
import { BreakdownList } from '@/components/analytics/BreakdownList';
import { DateRangePicker, type Range } from '@/components/analytics/DateRangePicker';
import type { StatsResponse } from '@/lib/db/queries/analytics';

function formatDuration(seconds: number): string {
  if (!seconds) return '0s';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function ShareDashboardClient({
  token,
  initial,
}: {
  token: string;
  initial: StatsResponse;
}) {
  const [range, setRange] = useState<Range>(initial.range);
  const [stats, setStats] = useState<StatsResponse>(initial);

  async function changeRange(next: Range) {
    setRange(next);
    try {
      const res = await fetch(`/api/share?token=${token}&range=${next}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        const { site, ...rest } = json;
        setStats(rest as StatsResponse);
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <DateRangePicker value={range} onChange={changeRange} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Visitors" value={stats.overview.visitors.toLocaleString()} Icon={Users} />
        <StatCard label="Pageviews" value={stats.overview.pageviews.toLocaleString()} Icon={Eye} />
        <StatCard label="Bounce rate" value={`${stats.overview.bounceRate}%`} Icon={MousePointerClick} />
        <StatCard label="Avg. duration" value={formatDuration(stats.overview.avgDuration)} Icon={Timer} />
      </div>

      <div className="rounded-lg bg-bg-elevated border border-border p-5">
        <h3 className="font-semibold text-sm mb-4">Traffic</h3>
        <TimeSeriesChart data={stats.timeSeries} bucket={stats.bucket} />
      </div>

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
      </div>
    </div>
  );
}
