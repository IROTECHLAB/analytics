'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function NewSiteForm() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, name }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Failed to create site');
      setLoading(false);
      return;
    }

    const { site } = await res.json();
    router.push(`/dashboard/sites/${site.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold">
          Site name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Blog"
          required
          maxLength={100}
          className="w-full px-3 py-2.5 rounded-md bg-bg-overlay border border-border-strong text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors duration-base"
        />
        <p className="text-xs text-text-subtle">
          Just for you — a friendly label.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="domain" className="text-sm font-semibold">
          Domain
        </label>
        <input
          id="domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          required
          maxLength={255}
          className="w-full px-3 py-2.5 rounded-md bg-bg-overlay border border-border-strong text-sm font-mono focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors duration-base"
        />
        <p className="text-xs text-text-subtle">
          Where this site lives — no <code className="text-brand-400">https://</code>, no trailing slash.
        </p>
      </div>

      {error && (
        <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-md p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !domain || !name}
        className="w-full px-4 py-2.5 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all duration-base hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-glow"
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        {loading ? 'Creating…' : 'Create site'}
      </button>
    </form>
  );
}
