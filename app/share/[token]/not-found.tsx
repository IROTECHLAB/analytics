import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <Activity size={40} className="mx-auto text-text-subtle" />
        <h1 className="text-2xl font-bold">Dashboard not available</h1>
        <p className="text-sm text-text-muted">
          This shared link is invalid, has been disabled, or the site no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm text-white shadow-glow hover:shadow-glow-hover transition-all"
          style={{ backgroundImage: 'var(--brand-gradient)' }}
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
