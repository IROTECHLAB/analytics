'use client';

import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';

export type CustomEvent = {
  name: string | null;
  count: number;
  uniques: number;
};

export function CustomEventsList({ events }: { events: CustomEvent[] }) {
  const [expanded, setExpanded] = useState(true);

  if (!events.length) {
    return (
      <div className="rounded-lg bg-bg-elevated border border-border p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Zap size={14} className="text-brand-500" />
          Custom events
        </h3>
        <p className="text-sm text-text-subtle">
          No custom events yet. Use{' '}
          <code className="text-brand-400">window.iro.track(&apos;name&apos;)</code>{' '}
          to send them.
        </p>
      </div>
    );
  }

  const max = Math.max(...events.map((e) => e.count), 1);

  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-5">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2 mb-3"
      >
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Zap size={14} className="text-brand-500" />
          Custom events
        </h3>
        {expanded ? (
          <ChevronUp size={14} className="text-text-subtle" />
        ) : (
          <ChevronDown size={14} className="text-text-subtle" />
        )}
      </button>

      {expanded && (
        <ul className="space-y-2.5">
          {events.map((ev, i) => (
            <li key={`${ev.name}-${i}`} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-mono text-xs text-text" title={ev.name ?? ''}>
                  {ev.name}
                </span>
                <span className="tnum text-text-muted font-mono text-xs">
                  {ev.count.toLocaleString()}
                  <span className="text-text-subtle"> · {ev.uniques} unique</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((ev.count / max) * 100, 2)}%`,
                    backgroundImage: 'var(--brand-gradient)',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
