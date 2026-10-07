import Link from 'next/link';
import { Logo } from '@/components/marketing/Logo';
import { SiteSwitcher } from './SiteSwitcher';
import type { Site } from '@/lib/db/schema';

export function Topbar({
  sites,
  currentSiteId,
  userInitials,
  userPicture,
}: {
  sites: Site[];
  currentSiteId?: string;
  userInitials: string;
  userPicture?: string | null;
}) {
  const hasSwitcher = sites.length > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-3">
        {/* Single row on desktop, two rows on mobile */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Logo href="/dashboard" size="sm" wordmark="always" />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Site switcher inline on md+ */}
            {hasSwitcher && (
              <div className="hidden md:block">
                <SiteSwitcher sites={sites} currentSiteId={currentSiteId} />
              </div>
            )}

            <Link
              href="/dashboard/settings"
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white hover:opacity-90 transition-opacity ring-1 ring-border flex-shrink-0"
              title="Settings"
            >
              {userPicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userPicture}
                  alt="Account"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundImage: 'var(--brand-gradient)' }}
                >
                  {userInitials}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile-only: full-width site switcher on its own row */}
        {hasSwitcher && (
          <div className="mt-3 md:hidden">
            <SiteSwitcher sites={sites} currentSiteId={currentSiteId} />
          </div>
        )}
      </div>
    </header>
  );
}
