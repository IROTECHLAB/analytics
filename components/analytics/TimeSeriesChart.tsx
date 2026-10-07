'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type Point = { ts: string; pageviews: number; visitors: number };

function formatTick(iso: string, bucket: 'hour' | 'day') {
  const d = new Date(iso);
  if (bucket === 'hour') {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatTooltipLabel(iso: string, bucket: 'hour' | 'day') {
  const d = new Date(iso);
  if (bucket === 'hour') {
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function TimeSeriesChart({
  data,
  bucket,
}: {
  data: Point[];
  bucket: 'hour' | 'day';
}) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-text-subtle">
        No data in this range.
      </div>
    );
  }

  return (
    <div className="h-64 -ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="ts"
            tickFormatter={(v) => formatTick(v, bucket)}
            stroke="var(--text-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />
          <YAxis
            stroke="var(--text-subtle)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
              color: 'var(--text)',
            }}
            labelFormatter={(v) => formatTooltipLabel(v as string, bucket)}
          />
          <Area
            type="monotone"
            dataKey="pageviews"
            name="Pageviews"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#pvGrad)"
          />
          <Area
            type="monotone"
            dataKey="visitors"
            name="Visitors"
            stroke="var(--chart-2)"
            strokeWidth={2}
            fill="transparent"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
