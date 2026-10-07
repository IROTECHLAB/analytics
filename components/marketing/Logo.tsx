import Link from 'next/link';

type Wordmark = 'auto' | 'always' | 'never';

export function Logo({
  href = '/',
  size = 'md',
  wordmark = 'auto',
}: {
  href?: string;
  size?: 'sm' | 'md';
  wordmark?: Wordmark;
}) {
  const iconSize = size === 'sm' ? 24 : 28;
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  // Compute the wordmark visibility class based on the prop
  const wordmarkClass =
    wordmark === 'always'
      ? 'flex'
      : wordmark === 'never'
      ? 'hidden'
      : 'hidden sm:flex';

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-bold ${textSize} tracking-tight min-w-0`}
      aria-label="IROTECHLAB ANALYTICS"
    >
      {/* Pulse icon — always visible */}
      <svg
        viewBox="0 0 200 200"
        width={iconSize}
        height={iconSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d="M 100 60 L 100 88 L 118 98 L 82 108 L 100 118 L 100 145"
          stroke="url(#pulseGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="150" r="7" fill="#10b981" />
        <circle cx="100" cy="38" r="14" fill="#10b981" />
        <circle cx="100" cy="38" r="6" fill="#0a0f0d" />
      </svg>

      {/* Wordmark — visibility controlled by wordmark prop */}
      <span className={`${wordmarkClass} items-baseline gap-1.5 min-w-0`}>
        <span className="text-text">IROTECHLAB</span>
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: 'var(--brand-gradient)' }}
        >
          ANALYTICS
        </span>
      </span>
    </Link>
  );
}
