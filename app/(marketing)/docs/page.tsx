import Link from 'next/link';
import { BookOpen, Code2, Server, Webhook, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'Docs — IROTECHLAB ANALYTICS',
  description: 'Self-host guide, tracking snippet, custom events, webhooks.',
};

const TRACKING_SNIPPET = `<script defer
  data-site="iro_site_xxxxxxxxxxxx"
  src="https://irotechlab-analytics.netlify.app/script.js"
></script>`;

const CUSTOM_EVENT = `// Track any custom event
window.iro.track('signup_complete', { plan: 'pro' });
window.iro.track('checkout_started', { amount: 29 });`;

const SPA = `// Single-page apps: the script auto-detects
// pushState / popstate / hashchange. Nothing to do.`;

const API_COLLECT = `GET https://irotechlab-analytics.netlify.app/api/collect
  ?site=iro_site_xxxxxxxxxxxx
  &path=%2Fpage
  &ref=https%3A%2F%2Fgoogle.com
  &type=pageview

// Or POST (used by script.js sendBeacon):
{
  "site": "iro_site_xxxxxxxxxxxx",
  "path": "/page",
  "ref": "https://google.com",
  "type": "pageview"
}`;

export default function DocsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-16 space-y-16">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-elevated text-xs text-text-muted">
          <BookOpen size={12} className="text-brand-500" />
          Documentation
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Docs</h1>
        <p className="text-text-muted max-w-2xl">
          Everything you need to embed tracking, track custom events, and
          self-host IROTECHLAB ANALYTICS.
        </p>
      </header>

      {/* TOC */}
      <nav className="rounded-lg bg-bg-elevated border border-border p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-subtle mb-3">
          On this page
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <li>
            <a href="#install" className="text-text-muted hover:text-brand-400">
              → Install the tracking script
            </a>
          </li>
          <li>
            <a href="#events" className="text-text-muted hover:text-brand-400">
              → Custom events
            </a>
          </li>
          <li>
            <a href="#spa" className="text-text-muted hover:text-brand-400">
              → Single-page apps
            </a>
          </li>
          <li>
            <a href="#api" className="text-text-muted hover:text-brand-400">
              → Collection API
            </a>
          </li>
          <li>
            <a href="#self-host" className="text-text-muted hover:text-brand-400">
              → Self-hosting
            </a>
          </li>
          <li>
            <a href="#privacy" className="text-text-muted hover:text-brand-400">
              → What we collect
            </a>
          </li>
        </ul>
      </nav>

      {/* Install */}
      <section id="install" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code2 size={20} className="text-brand-500" />
          Install the tracking script
        </h2>
        <p className="text-sm text-text-muted">
          Grab your site key from the dashboard, then paste this one line
          into the <code className="text-brand-400">&lt;head&gt;</code> of
          every page you want to track.
        </p>
        <pre className="rounded-lg bg-bg-elevated border border-border p-4 text-xs font-mono overflow-x-auto">
          <code>{TRACKING_SNIPPET}</code>
        </pre>
        <p className="text-xs text-text-subtle">
          That&apos;s it — pageviews start flowing immediately.
        </p>
      </section>

      {/* Custom events */}
      <section id="events" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap size={20} className="text-brand-500" />
          Custom events
        </h2>
        <p className="text-sm text-text-muted">
          Track anything with{' '}
          <code className="text-brand-400">window.iro.track()</code>. The
          script exposes this global once loaded.
        </p>
        <pre className="rounded-lg bg-bg-elevated border border-border p-4 text-xs font-mono overflow-x-auto">
          <code>{CUSTOM_EVENT}</code>
        </pre>
      </section>

      {/* SPA */}
      <section id="spa" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Zap size={20} className="text-brand-500" />
          Single-page apps
        </h2>
        <p className="text-sm text-text-muted">
          No config needed. The script hooks into{' '}
          <code className="text-brand-400">pushState</code>,{' '}
          <code className="text-brand-400">popstate</code>, and{' '}
          <code className="text-brand-400">hashchange</code> automatically.
        </p>
        <pre className="rounded-lg bg-bg-elevated border border-border p-4 text-xs font-mono overflow-x-auto">
          <code>{SPA}</code>
        </pre>
      </section>

      {/* API */}
      <section id="api" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Webhook size={20} className="text-brand-500" />
          Collection API
        </h2>
        <p className="text-sm text-text-muted">
          You can also POST directly if you prefer sending events
          server-side.
        </p>
        <pre className="rounded-lg bg-bg-elevated border border-border p-4 text-xs font-mono overflow-x-auto">
          <code>{API_COLLECT}</code>
        </pre>
      </section>

      {/* Self-host */}
      <section id="self-host" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Server size={20} className="text-brand-500" />
          Self-hosting
        </h2>
        <p className="text-sm text-text-muted">
          Full instructions live on the GitHub repo.
        </p>
        <ol className="list-decimal list-inside text-sm text-text-muted space-y-2 pl-2">
          <li>Clone the repo</li>
          <li>
            Register your own app at{' '}
            <a
              href="https://irotechlab-auth.netlify.app/developer"
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-400 hover:underline"
            >
              irotechlab-auth.netlify.app/developer
            </a>
          </li>
          <li>Create a Postgres database (Neon, Supabase, RDS, etc.)</li>
          <li>Set env vars in <code className="text-brand-400">.env.local</code></li>
          <li>
            Run <code className="text-brand-400">npm run db:push</code> then{' '}
            <code className="text-brand-400">npm run dev</code>
          </li>
        </ol>
        <a
          href="https://github.com/IROTECHLAB/irotechlab-analytics"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block text-sm text-brand-400 hover:underline"
        >
          Full self-host guide on GitHub →
        </a>
      </section>

      {/* Privacy */}
      <section id="privacy" className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck size={20} className="text-brand-500" />
          What we collect
        </h2>
        <ul className="space-y-2 text-sm text-text-muted">
          <li>✅ Page path, referrer host, timestamp</li>
          <li>✅ Country (from CDN header, not stored IP)</li>
          <li>✅ Device type, browser, OS (from user agent)</li>
          <li>✅ Screen size bucket, language</li>
          <li>✅ UTM parameters</li>
          <li>❌ No cookies</li>
          <li>❌ No IP addresses stored</li>
          <li>❌ No cross-site tracking</li>
          <li>❌ No personal identifiers</li>
        </ul>
        <p className="text-xs text-text-subtle">
          Visitor IDs are derived by hashing IP + user agent + date, and
          rotate every 24 hours. No personal data is ever persisted.
        </p>
      </section>

      <div className="border-t border-border pt-8 text-center">
        <p className="text-sm text-text-muted">
          Still stuck?{' '}
          <Link href="/" className="text-brand-400 hover:underline">
            Back to home
          </Link>{' '}
          or message us on telegram: @ironmanhindigaming or instagram: @ironmanyt00
        </p>
      </div>
    </main>
  );
}
