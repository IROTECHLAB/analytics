import { CopyButton } from './CopyButton';

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg bg-bg-overlay border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs text-text-subtle font-mono">
          {label ?? 'code'}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-text leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
