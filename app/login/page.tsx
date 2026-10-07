import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/require-user';

export const dynamic = 'force-dynamic';

const ERROR_MESSAGES: Record<string, string> = {
  account_disabled: 'This account has been disabled. Contact support.',
  state_mismatch: 'Sign-in session expired. Try again.',
  token_exchange: 'Could not complete sign-in. Try again.',
  invalid_token: 'Invalid sign-in token. Try again.',
  access_denied: 'You cancelled the sign-in.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  const errKey = searchParams.error;
  const errMsg = errKey ? ERROR_MESSAGES[errKey] ?? `Sign-in error: ${errKey}` : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            IROTECHLAB{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              ANALYTICS
            </span>
          </h1>
          <p className="text-sm text-text-muted">Sign in to continue</p>
        </div>

        {errMsg && (
          <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-md p-3">
            {errMsg}
          </div>
        )}

        <a
          href="/api/auth/login"
          className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-md font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all duration-base hover:-translate-y-px"
          style={{ backgroundImage: 'var(--brand-gradient)' }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <circle cx="50" cy="18" r="8" fill="currentColor" stroke="none" />
              <path d="M 25 30 L 75 30 L 75 55 Q 75 75 50 88 Q 25 75 25 55 Z" />
              <circle cx="50" cy="52" r="5" fill="currentColor" stroke="none" />
              <rect
                x="47.4"
                y="55"
                width="5"
                height="11"
                rx="2.5"
                fill="currentColor"
                stroke="none"
              />
            </g>
          </svg>
          Continue with IrotechLab
        </a>

        <p className="text-center text-xs text-text-subtle">
          By continuing you agree to our terms.
        </p>
      </div>
    </main>
  );
}
