// Minimal, dependency-free UA parser.
// Good enough for analytics breakdowns — no need for ua-parser-js.

export type ParsedUA = {
  device: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown';
  browser: string;
  os: string;
};

export function parseUserAgent(ua: string | null | undefined): ParsedUA {
  if (!ua) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

  const s = ua.toLowerCase();

  // Bots
  if (/bot|crawler|spider|crawling|facebookexternalhit|slackbot|whatsapp/i.test(ua)) {
    return { device: 'Bot', browser: 'Bot', os: 'Unknown' };
  }

  // Device
  let device: ParsedUA['device'] = 'Desktop';
  if (/ipad|tablet|playbook|silk/i.test(ua)) device = 'Tablet';
  else if (/mobi|android|iphone|ipod|windows phone/i.test(ua)) device = 'Mobile';

  // Browser (order matters — most specific first)
  let browser = 'Unknown';
  if (s.includes('edg/')) browser = 'Edge';
  else if (s.includes('opr/') || s.includes('opera')) browser = 'Opera';
  else if (s.includes('chrome') && !s.includes('chromium')) browser = 'Chrome';
  else if (s.includes('firefox')) browser = 'Firefox';
  else if (s.includes('safari') && !s.includes('chrome')) browser = 'Safari';
  else if (s.includes('chromium')) browser = 'Chromium';

  // OS
  let os = 'Unknown';
  if (s.includes('windows')) os = 'Windows';
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS';
  else if (s.includes('mac os x') || s.includes('macintosh')) os = 'macOS';
  else if (s.includes('android')) os = 'Android';
  else if (s.includes('linux')) os = 'Linux';

  return { device, browser, os };
}
