import { type LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  hint,
  Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider text-text-subtle font-semibold">
          {label}
        </span>
        {Icon && <Icon size={16} className="text-brand-500" />}
      </div>
      <div className="text-3xl font-bold tnum">{value}</div>
      {hint && <div className="text-xs text-text-muted mt-1">{hint}</div>}
    </div>
  );
}
