import { Server, Terminal, Database, Github } from 'lucide-react';

const SELFHOST_SNIPPET = `# 1. Clone the repo
git clone https://github.com/IROTECHLAB/irotechlab-analytics
cd irotechlab-analytics

# 2. Install deps
npm install

# 3. Configure env
cp .env.example .env.local
# edit .env.local with your:
#   IRO_CLIENT_ID, IRO_CLIENT_SECRET, IRO_WEBHOOK_SECRET
#   DATABASE_URL, SESSION_SECRET, APP_URL

# 4. Push schema + run
npm run db:push
npm run dev`;

export function SelfHost() {
  return (
    <section id="self-host" className="max-w-6xl mx-auto px-4 md:px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-bg-elevated text-xs text-text-muted">
            <Server size={12} className="text-brand-500" />
            Self-host in 5 minutes
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Your data. Your server. Your rules.
          </h2>

          <p className="text-text-muted leading-relaxed">
            Run IROTECHLAB ANALYTICS on your own infrastructure. Same app,
            same dashboard \u2014 but the database lives on your terms, and
            nobody else ever sees your numbers.
          </p>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Terminal size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span>Node.js 18+ and any Postgres database</span>
            </li>
            <li className="flex items-start gap-3">
              <Database size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span>Neon, Supabase, RDS, or a local Postgres container</span>
            </li>
            <li className="flex items-start gap-3">
              <Github size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
              <span>MIT-licensed \u2014 audit, fork, contribute</span>
            </li>
          </ul>

          <a
            href="https://github.com/IROTECHLAB/irotechlab-analytics"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>

        <div className="rounded-lg bg-bg-elevated border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-danger/60" />
            <span className="w-2 h-2 rounded-full bg-warning/60" />
            <span className="w-2 h-2 rounded-full bg-success/60" />
            <span className="text-xs text-text-subtle ml-2 font-mono">
              terminal
            </span>
          </div>
          <pre className="p-5 text-xs font-mono text-text overflow-x-auto leading-relaxed">
            <code>{SELFHOST_SNIPPET}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
