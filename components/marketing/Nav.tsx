import Link from 'next/link';
import { Logo } from './Logo';
import { getCurrentUser } from '@/lib/auth/require-user';

export async function Nav() {
  const user = await getCurrentUser();
  const hasFewButtons = !!user; // signed-in → fewer CTAs

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-shrink">
            <Logo
              href="/"
              size="sm"
              wordmark={hasFewButtons ? 'always' : 'auto'}
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/#features"
              className="text-text-muted hover:text-text transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-text-muted hover:text-text transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-text-muted hover:text-text transition-colors"
            >
              Docs
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <Link
                href="/dashboard"
                className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px whitespace-nowrap"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-3 py-2 rounded-md text-xs sm:text-sm font-semibold text-text-muted hover:text-text transition-colors whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all hover:-translate-y-px whitespace-nowrap"
                  style={{ backgroundImage: 'var(--brand-gradient)' }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
