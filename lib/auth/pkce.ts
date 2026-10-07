import crypto from 'crypto';

function base64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generatePKCE() {
  const verifier = base64url(crypto.randomBytes(32));       // 43 chars
  const challenge = base64url(
    crypto.createHash('sha256').update(verifier).digest()
  );                                                        // 43 chars
  const state = base64url(crypto.randomBytes(16));          // 22 chars
  return { verifier, challenge, state };
}
