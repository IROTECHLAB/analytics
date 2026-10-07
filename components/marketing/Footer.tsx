import Link from 'next/link';
import { Github } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-3">
          <Logo href="/" size="sm" wordmark="always" />
          <p className="text-xs text-text-muted max-w-xs">
            Privacy-first, self-hostable web analytics.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#features" className="text-text-muted hover:text-text">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-text-muted hover:text-text">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/docs" className="text-text-muted hover:text-text">
                Docs
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Self-host
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs#self-host" className="text-text-muted hover:text-text">
                Quick start
              </Link>
            </li>
            <li>
              <a
                href="https://github.com/IROTECHLAB/analytics"
                target="_blank"
                rel="noreferrer noopener"
                className="text-text-muted hover:text-text inline-flex items-center gap-1"
              >
                <Github size={12} />
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://t.me/ironmanhindigaming"
                target="_blank"
                rel="noreferrer noopener"
                className="text-text-muted hover:text-text"
              >
                Telegram
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/ironmanyt00"
                target="_blank"
                rel="noreferrer noopener"
                className="text-text-muted hover:text-text"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://auth.irotechlab.xi.to"
                target="_blank"
                rel="noreferrer noopener"
                className="text-text-muted hover:text-text"
              >
                IrotechLab Auth
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-text-subtle">
          <span>© {new Date().getFullYear()} IROTECHLAB</span>
          <span>Built with IrotechLab Auth · Postgres · Next.js</span>
        </div>
      </div>
    </footer>
  );
}
