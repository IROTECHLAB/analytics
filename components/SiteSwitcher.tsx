'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Activity } from 'lucide-react';
import type { Site } from '@/lib/db/schema';

export function SiteSwitcher({
  sites,
  currentSiteId,
}: {
  sites: Site[];
  currentSiteId?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const current = sites.find((s) => s.id === currentSiteId) ?? sites[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!sites.length) return null;

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full md:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 md:py-1.5 rounded-md border border-border-strong bg-bg-overlay hover:bg-bg-elevated transition-colors text-sm font-semibold"
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <Activity size={14} className="text-brand-500 flex-shrink-0" />
          <span className="truncate">{current?.name ?? 'Select site'}</span>
        </span>
        <ChevronDown size={14} className="text-text-subtle flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 md:left-auto md:right-0 mt-2 md:w-64 z-50 rounded-lg bg-bg-overlay border border-border-strong shadow-lg overflow-hidden">
          <ul className="max-h-72 overflow-auto py-1">
            {sites.map((site) => (
              <li key={site.id}>
                <Link
                  href={`/dashboard/sites/${site.id}`}
                  className={`flex flex-col gap-0.5 px-3 py-2 hover:bg-bg-elevated transition-colors ${
                    site.id === current?.id ? 'bg-bg-elevated' : ''
                  }`}
                >
                  <span className="text-sm font-semibold truncate">{site.name}</span>
                  <span className="text-xs text-text-subtle font-mono truncate">
                    {site.domain}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/sites/new"
            className="flex items-center gap-2 px-3 py-2 border-t border-border text-sm text-text-muted hover:text-text hover:bg-bg-elevated transition-colors"
          >
            <Plus size={14} />
            Add site
          </Link>
        </div>
      )}
    </div>
  );
}
