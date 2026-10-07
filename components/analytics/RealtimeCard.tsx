'use client';

import { useEffect, useState } from 'react';

export function RealtimeCard({
  siteId,
  initial,
}: {
  siteId: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch(`/api/sites/${siteId}/stats?range=24h`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && typeof json.realtime === 'number') {
          setCount((prev) => {
            if (prev !== json.realtime) setPulse(true);
            return json.realtime;
          });
          setTimeout(() => setPulse(false), 600);
        }
      } catch {}
    }
    const id = setInterval(tick, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [siteId]);

  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-text-subtle font-semibold">
          Realtime
        </span>
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full rounded-full bg-success ${
              pulse ? 'animate-ping' : ''
            }`}
            style={{ opacity: 0.5 }}
          />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
      </div>
      <div className="text-3xl font-bold tnum">{count}</div>
      <div className="text-xs text-text-muted mt-1">Active visitors (last 5 min)</div>
    </div>
  );
}
