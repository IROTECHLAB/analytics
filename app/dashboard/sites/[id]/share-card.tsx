'use client';

import { useState } from 'react';
import { Share2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { Site } from '@/lib/db/schema';
import { CopyButton } from '@/components/CopyButton';

export function ShareSettingsCard({
  site,
  appUrl,
}: {
  site: Site;
  appUrl: string;
}) {
  const [enabled, setEnabled] = useState(site.shareEnabled);
  const [token, setToken] = useState(site.shareToken);
  const [loading, setLoading] = useState(false);

  async function call(action: 'enable' | 'disable' | 'regenerate') {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${site.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const { site: updated } = await res.json();
        setEnabled(updated.shareEnabled);
        setToken(updated.shareToken);
      }
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = token ? `${appUrl}/share/${token}` : '';

  return (
    <section className="rounded-lg bg-bg-elevated border border-border p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Share2 size={16} className="text-brand-500" />
          Public dashboard
        </h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            enabled
              ? 'text-success border-success/30 bg-success/10'
              : 'text-text-subtle border-border'
          }`}
        >
          {enabled ? 'Live' : 'Off'}
        </span>
      </div>

      <p className="text-sm text-text-muted">
        Share a read-only version of this site&apos;s analytics with anyone via a
        private link. No account needed to view.
      </p>

      {enabled && shareUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-bg-overlay border border-border font-mono text-xs">
            <span className="flex-1 truncate">{shareUrl}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CopyButton text={shareUrl} label="Copy link" />
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
            >
              Open
            </a>
            <button
              type="button"
              onClick={() => call('regenerate')}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors disabled:opacity-50"
              title="Generate a new link — old one stops working"
            >
              <RefreshCw size={12} />
              Rotate
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {enabled ? (
          <button
            type="button"
            onClick={() => call('disable')}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold border border-border-strong text-text-muted hover:text-danger transition-colors disabled:opacity-50"
          >
            <EyeOff size={14} />
            Disable sharing
          </button>
        ) : (
          <button
            type="button"
            onClick={() => call('enable')}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px disabled:opacity-50"
            style={{ backgroundImage: 'var(--brand-gradient)' }}
          >
            <Eye size={14} />
            Enable sharing
          </button>
        )}
      </div>
    </section>
  );
}
