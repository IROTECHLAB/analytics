# IROTECHLAB ANALYTICS

Privacy-first, self-hostable web analytics. Own your data.

A lightweight, cookie-free Google Analytics alternative.

Live: https://analytics.irotechlab.xi.to

## Features

- Cookie-free, GDPR-friendly by default
- Under 2KB tracking script
- Realtime dashboard
- Custom events via window.iro.track()
- Auto-tracking of outbound links, downloads, UTM params
- Breakdowns: pages, referrers, countries, devices, browsers, OS, screens, languages
- Entry / exit pages
- Public shareable dashboards
- CSV export of raw events
- Self-hostable (MIT licensed)
- Powered by IrotechLab Auth (OIDC + PKCE)

## Self-host in 5 minutes

### 1. Register an app

Visit https://auth.irotechlab.xi.to/developer/new

- Client type: Confidential
- Scopes: openid, profile, email
- Redirect URIs:
  - http://localhost:3000/api/auth/callback
  - https://your-domain.com/api/auth/callback

Save your client_id and client_secret.

### 2. Add a webhook

Same app page:

- URL: https://your-domain.com/api/webhooks/iro
- Events: user.authorized, user.revoked, user.revoked_all

Save the signing secret.

### 3. Clone and install

```bash
git clone https://github.com/IROTECHLAB/analytics
cd analytics
npm install
cp .env.example .env.local
```

### 4. Fill .env.local

```txt
APP_URL=http://localhost:3000
IRO_ISSUER=https://auth.irotechlab.xi.to
IRO_CLIENT_ID=iro_xxxxx
IRO_CLIENT_SECRET=iro_sk_live_xxxxx
IRO_WEBHOOK_SECRET=iro_whsec_xxxxx
DATABASE_URL=postgres://...
SESSION_SECRET=openssl rand -base64 32
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

### 5. Push schema + run

```bash
npm run db:push
npm run dev
```

Open http://localhost:3000

### 6. Deploy

Push to GitHub, connect on Netlify, add the same env vars, deploy.

## Embed the tracker

Add to your site's <head>:
```html
<script defer
 data-site="iro_site_xxxxxxxxxxxx"
 src="https://your-domain.com/script.js"
></script>
```

That's it — pageviews start flowing.

### Custom events

```javascript
window.iro.track('signup_complete', { plan: 'pro' });
```

### Single-page apps

Auto-handled — hooks into pushState, popstate, and hashchange.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Neon Postgres + Drizzle ORM
- IrotechLab Auth (OIDC + PKCE)
- Recharts
- Netlify

## Privacy

Collect: page path, referrer host, timestamp, country (from CDN header), device type, browser, OS, screen bucket, language, UTM params.

Never collect: cookies, IP addresses, cross-site identifiers, personal data.

Visitor IDs rotate every 24 hours.

## License

MIT — see [LICENSE](LICENSE).

Built by IROTECHLAB.
