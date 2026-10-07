'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

export function ExportButton({
  siteId,
  range,
}: {
  siteId: string;
  range: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/export?range=${range}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `events-${range}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors disabled:opacity-50"
    >
      <Download size={14} />
      {loading ? 'Exporting…' : 'Export CSV'}
    </button>
  );
}
