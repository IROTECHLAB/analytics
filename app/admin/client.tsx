'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Globe,
  Activity,
  Sparkles,
  Ban,
  Search,
  LogOut,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
} from 'lucide-react';
import type { AdminStats, AdminUserRow } from '@/lib/db/queries/admin';

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function daysLeft(d: Date | null): number | null {
  if (!d) return null;
  const t = new Date(d).getTime();
  if (t < Date.now()) return 0;
  return Math.ceil((t - Date.now()) / (24 * 60 * 60 * 1000));
}

export function AdminClient({
  stats,
  users,
  initialQuery,
}: {
  stats: AdminStats;
  users: AdminUserRow[];
  initialQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = users.length > 0 && selected.size === users.length;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(users.map((u) => u.id)));
  }

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/admin?q=${encodeURIComponent(query)}`);
  }

  async function grantPro(id: string) {
    setBusy(id);
    try {
      await fetch(`/api/admin/users/${id}/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 30 }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function action(id: string, actionName: string) {
    setBusy(id);
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function bulk(actionName: string) {
    const ids = Array.from(selected);
    if (!ids.length) return;
    setBusy('__bulk__');
    try {
      await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName, userIds: ids, days: 30 }),
      });
      setSelected(new Set());
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="font-bold text-sm">
            Admin Console ·{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              IROTECHLAB ANALYTICS
            </span>
          </h1>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatBox label="Users" value={stats.totalUsers} Icon={Users} />
          <StatBox label="Sites" value={stats.totalSites} Icon={Globe} />
          <StatBox label="Events" value={stats.totalEvents} Icon={Activity} />
          <StatBox label="Pro users" value={stats.proUsers} Icon={Sparkles} />
          <StatBox label="Disabled" value={stats.disabledUsers} Icon={Ban} />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <form onSubmit={search} className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by email or name…"
                className="w-full pl-9 pr-3 py-2 rounded-md bg-bg-overlay border border-border-strong text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-semibold text-white shadow-glow hover:shadow-glow-hover transition-all"
              style={{ backgroundImage: 'var(--brand-gradient)' }}
            >
              Search
            </button>
            {initialQuery && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  router.push('/admin');
                }}
                className="px-3 py-2 rounded-md text-sm font-semibold border border-border-strong text-text-muted hover:text-text"
              >
                Clear
              </button>
            )}
          </form>

          <a
            href="/api/admin/users/export"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text transition-colors"
          >
            <Download size={12} />
            Export CSV
          </a>
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div className="rounded-lg bg-bg-elevated border border-brand-500/40 p-3 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-sm font-semibold">
              {selected.size} selected
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => bulk('grant_pro')}
                disabled={busy === '__bulk__'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-glow"
                style={{ backgroundImage: 'var(--brand-gradient)' }}
              >
                <Sparkles size={12} />
                Grant Pro 30d
              </button>
              <button
                type="button"
                onClick={() => bulk('enable')}
                disabled={busy === '__bulk__'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-text"
              >
                <CheckCircle2 size={12} />
                Enable
              </button>
              <button
                type="button"
                onClick={() => bulk('disable')}
                disabled={busy === '__bulk__'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-border-strong text-text-muted hover:text-danger"
              >
                <Ban size={12} />
                Disable
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs text-text-subtle hover:text-text px-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="rounded-lg bg-bg-elevated border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-overlay text-xs uppercase tracking-wider text-text-subtle">
                <tr>
                  <th className="w-8 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="accent-brand-500"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold">Plan</th>
                  <th className="text-left px-4 py-3 font-semibold">Expires</th>
                  <th className="text-right px-4 py-3 font-semibold">Sites</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-text-muted text-sm">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const left = daysLeft(u.planExpiresAt);
                    return (
                      <tr key={u.id} className="border-t border-border">
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(u.id)}
                            onChange={() => toggle(u.id)}
                            className="accent-brand-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {u.picture ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.picture}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundImage: 'var(--brand-gradient)' }}
                              >
                                {initials(u.name, u.email)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium truncate max-w-[200px]">
                                {u.name ?? '—'}
                              </div>
                              <div className="text-xs text-text-muted truncate max-w-[200px]">
                                {u.email ?? u.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                              u.plan === 'pro'
                                ? 'text-white'
                                : 'text-text-muted border border-border'
                            }`}
                            style={
                              u.plan === 'pro'
                                ? { backgroundImage: 'var(--brand-gradient)' }
                                : undefined
                            }
                          >
                            {u.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-muted">
                          {u.plan === 'pro' && left !== null
                            ? left > 0
                              ? `${left} day${left === 1 ? '' : 's'} left`
                              : 'Expired'
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-right tnum">{u.siteCount}</td>
                        <td className="px-4 py-3">
                          {u.disabled ? (
                            <span className="inline-flex items-center gap-1 text-xs text-danger">
                              <XCircle size={12} />
                              Disabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-success">
                              <CheckCircle2 size={12} />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <ActionButton
                              onClick={() => grantPro(u.id)}
                              disabled={busy === u.id}
                              icon={<Sparkles size={12} />}
                              label="+30d"
                              primary
                            />
                            {u.plan === 'pro' && (
                              <ActionButton
                                onClick={() => action(u.id, 'revoke_pro')}
                                disabled={busy === u.id}
                                icon={<RotateCcw size={12} />}
                                label="Revoke"
                              />
                            )}
                            {u.disabled ? (
                              <ActionButton
                                onClick={() => action(u.id, 'enable')}
                                disabled={busy === u.id}
                                icon={<CheckCircle2 size={12} />}
                                label="Enable"
                              />
                            ) : (
                              <ActionButton
                                onClick={() => action(u.id, 'disable')}
                                disabled={busy === u.id}
                                icon={<Ban size={12} />}
                                label="Disable"
                                danger
                              />
                            )}
                            <ActionButton
                              onClick={() => {
                                if (
                                  confirm(
                                    `Delete user ${u.email ?? u.id}? This wipes their sites and all events permanently.`
                                  )
                                ) {
                                  action(u.id, 'delete');
                                }
                              }}
                              disabled={busy === u.id}
                              icon={<Trash2 size={12} />}
                              label=""
                              danger
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg bg-bg-elevated border border-border p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs uppercase tracking-wider text-text-subtle font-semibold">
          {label}
        </span>
        <Icon size={14} className="text-brand-500" />
      </div>
      <div className="text-2xl font-bold tnum">{value.toLocaleString()}</div>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  icon,
  label,
  primary,
  danger,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  danger?: boolean;
}) {
  const base =
    'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border transition-colors disabled:opacity-50';
  if (primary) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${base} text-white border-transparent shadow-glow hover:shadow-glow-hover`}
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        {icon}
        {label}
      </button>
    );
  }
  if (danger) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`${base} border-border-strong text-text-muted hover:text-danger hover:border-danger/40`}
      >
        {icon}
        {label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} border-border-strong text-text-muted hover:text-text`}
    >
      {icon}
      {label}
    </button>
  );
}
