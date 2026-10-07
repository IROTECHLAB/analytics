export type BreakdownItem = {
  label: string;
  count: number;
};

export function BreakdownList({
  title,
  items,
  emptyLabel = 'No data',
}: {
  title: string;
  items: BreakdownItem[];
  emptyLabel?: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg bg-bg-elevated border border-border p-5">
        <h3 className="font-semibold text-sm mb-3">{title}</h3>
        <p className="text-sm text-text-subtle">{emptyLabel}</p>
      </div>
    );
  }

  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-5">
      <h3 className="font-semibold text-sm mb-3">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate text-text" title={item.label}>
                {item.label}
              </span>
              <span className="tnum text-text-muted font-mono text-xs">
                {item.count.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((item.count / max) * 100, 2)}%`,
                  backgroundImage: 'var(--brand-gradient)',
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
