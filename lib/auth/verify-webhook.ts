import crypto from 'crypto';
import { config } from '@/lib/config';

export function verifyWebhookSignature(opts: {
  rawBody: string;
  timestamp: string;
  signature: string;
}): boolean {
  const { rawBody, timestamp, signature } = opts;

  if (!timestamp || !signature) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false; // 5 min window

  const expected = crypto
    .createHmac('sha256', config.iro.webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const provided = signature.replace('sha256=', '');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(provided, 'hex');

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
