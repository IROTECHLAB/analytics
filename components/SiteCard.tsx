'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Site } from '@/lib/db/schema';

export function SiteCard({ site }: { site: Site }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${site.name}"? All analytics data will be lost.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/sites/${site.id}`, { method: 'DELETE' });
    if (res.ok) {
      window.location.reload();
    } else {
      setDeleting(false);
      alert('Failed to delete site');
    }
  }

  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-5 hover:border-border-strong transition-colors duration-base">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/dashboard/sites/${site.id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{site.name}</h3>
          <p className="text-sm text-text-muted truncate font-mono">{site.domain}</p>
          <p className="text-xs text-text-subtle mt-2 font-mono tnum">
            {site.publicKey}
          </p>
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-md text-text-subtle hover:text-danger hover:bg-danger/10 transition-colors duration-base disabled:opacity-50"
          aria-label="Delete site"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
