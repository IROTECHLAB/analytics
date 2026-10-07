import crypto from 'crypto';

// Daily-rotating visitor ID derived from IP + UA + site + date.
// No cookie, no persistent tracking. Standard privacy-first analytics approach.
export function deriveVisitorId(opts: {
  sitePublicKey: string;
  ip: string | null;
  userAgent: string | null;
}): string {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const raw = [
    opts.sitePublicKey,
    opts.ip ?? 'unknown',
    opts.userAgent ?? 'unknown',
    day,
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 24);
}

export function deriveSessionId(visitorId: string): string {
  // 30-minute bucket so a visitor's session resets after idle
  const bucket = Math.floor(Date.now() / (30 * 60 * 1000));
  const raw = `${visitorId}|${bucket}`;
  const hex = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);

  // Format as UUID v4-ish for the uuid column
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    '4' + hex.slice(13, 16),
    ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16) + hex.slice(17, 20),
    hex.slice(20, 32),
  ].join('-');
}
