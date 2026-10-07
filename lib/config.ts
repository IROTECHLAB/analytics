function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function optional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

const APP_URL = required('APP_URL').replace(/\/+$/, '');

export const config = {
  appUrl: APP_URL,
  cookieDomain: optional('COOKIE_DOMAIN') || undefined,
  nodeEnv: optional('NODE_ENV', 'development'),
  isProd: optional('NODE_ENV') === 'production',

  iro: {
    issuer: required('IRO_ISSUER').replace(/\/+$/, ''),
    clientId: required('IRO_CLIENT_ID'),
    clientSecret: required('IRO_CLIENT_SECRET'),
    webhookSecret: required('IRO_WEBHOOK_SECRET'),
    get redirectUri() {
      return `${APP_URL}/api/auth/callback`;
    },
    get webhookUrl() {
      return `${APP_URL}/api/webhooks/iro`;
    },
  },

  session: {
    secret: required('SESSION_SECRET'),
    cookieName: 'iro_analytics_session',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  db: {
    url: required('DATABASE_URL'),
  },
} as const;

export function printConfigSummary() {
  console.log('[config]', {
    appUrl: config.appUrl,
    redirectUri: config.iro.redirectUri,
    webhookUrl: config.iro.webhookUrl,
    nodeEnv: config.nodeEnv,
  });
}
