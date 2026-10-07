// Simple in-memory rate limiter. Works for single-region Netlify deployments.
// For multi-region, swap to Upstash Redis later.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { ok: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: maxAttempts - 1, resetIn: windowMs };
  }

  if (bucket.count >= maxAttempts) {
    return {
      ok: false,
      remaining: 0,
      resetIn: bucket.resetAt - now,
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: maxAttempts - bucket.count,
    resetIn: bucket.resetAt - now,
  };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get('x-nf-client-connection-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
