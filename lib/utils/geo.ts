import type { NextRequest } from 'next/server';

// Try common headers provided by CDNs/proxies.
// Netlify:  x-country, x-nf-client-connection-ip
// Cloudflare: cf-ipcountry
// Vercel: x-vercel-ip-country
export function getCountry(req: NextRequest): string {
  const candidates = [
    req.headers.get('x-country'),
    req.headers.get('cf-ipcountry'),
    req.headers.get('x-vercel-ip-country'),
    req.headers.get('x-geo-country'),
  ];

  for (const c of candidates) {
    if (c && c.length === 2 && c !== 'XX' && c !== 'T1') {
      return c.toUpperCase();
    }
  }
  return 'Unknown';
}

export function getClientIp(req: NextRequest): string | null {
  const h = req.headers;
  return (
    h.get('x-nf-client-connection-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    null
  );
}
