import crypto from 'crypto';

// Site public keys look like: iro_site_xxxxxxxxxxxxxxxxxxxx
export function generatePublicKey(): string {
  const rand = crypto.randomBytes(12).toString('base64url'); // ~16 chars
  return `iro_site_${rand}`;
}
