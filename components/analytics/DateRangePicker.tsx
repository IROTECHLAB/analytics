'use client';

export type Range = '24h' | '7d' | '30d' | '90d';

const OPTIONS: { value: Range; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
];

export function DateRangePicker({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-border-strong p-0.5 bg-bg-overlay">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors duration-base ${
            value === opt.value
              ? 'text-white'
              : 'text-text-muted hover:text-text'
          }`}
          style={
            value === opt.value
              ? { backgroundImage: 'var(--brand-gradient)' }
              : undefined
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
