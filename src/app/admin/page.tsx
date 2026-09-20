'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';

interface Channel {
  id: string;
  name: string;
  league: string;
  leagueIcon: string;
  home: string | null;
  away: string | null;
  homeScore: number | null;
  awayScore: number | null;
  minute: number | null;
  status: string;
  streamUrl: string | null;
  viewers: number;
}

const EMPTY_FORM = {
  name: '',
  league: '英超',
  leagueIcon: '🏴',
  home: '',
  away: '',
  homeScore: '',
  awayScore: '',
  minute: '',
  status: 'live' as 'live' | 'upcoming' | 'replay',
  streamUrl: '',
};

export default function AdminPage() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/admin/channels')
      .then((r) => r.json())
      .then((d) => d.ok && setChannels(d.channels))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userLoading) return;
    if (user && isAdmin) load();
    else setLoading(false);
  }, [userLoading, user, isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setError('');
    setShowForm(true);
  };

  const openEdit = (ch: Channel) => {
    setEditing(ch);
    setForm({
      name: ch.name,
      league: ch.league,
      leagueIcon: ch.leagueIcon,
      home: ch.home || '',
      away: ch.away || '',
      homeScore: ch.homeScore?.toString() || '',
      awayScore: ch.awayScore?.toString() || '',
      minute: ch.minute?.toString() || '',
      status: ch.status as any,
      streamUrl: ch.streamUrl || '',
    });
    setError('');
    setShowForm(true);
  };

  const submit = async () => {
    setError('');
    if (!form.name.trim()) return setError('请填名称');
    if (!form.streamUrl.trim()) return setError('请填流地址');
    setSaving(true);

    const payload: any = {
      name: form.name.trim(),
      league: form.league.trim(),
      leagueIcon: form.leagueIcon.trim() || '⚽',
      status: form.status,
      streamUrl: form.streamUrl.trim(),
      home: form.home.trim() || null,
      away: form.away.trim() || null,
      homeScore: form.homeScore ? parseInt(form.homeScore) : null,
      awayScore: form.awayScore ? parseInt(form.awayScore) : null,
      minute: form.minute ? parseInt(form.minute) : null,
    };

    try {
      const url = editing
        ? `/api/admin/channels/${editing.id}`
        : '/api/admin/channels';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      setShowForm(false);
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('确定删除这条频道？')) return;
    await fetch(`/api/admin/channels/${id}`, { method: 'DELETE' });
    setChannels((prev) => prev.filter((c) => c.id !== id));
  };

  if (userLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="text-4xl opacity-30">🚫</div>
        <p className="text-sm text-slate-500">无权限访问</p>
        <Link href="/" className="text-sm text-emerald-600">
          ← 返回首页
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="text-slate-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <h1 className="text-base font-semibold text-slate-800">频道管理</h1>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            + 新增
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex gap-4 pb-2.5">
          <Link
            href="/admin"
            className="text-[13px] font-medium text-emerald-600 pb-1.5 relative"
          >
            频道
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-emerald-600 rounded-full" />
          </Link>
          <Link
            href="/admin/replays"
            className="text-[13px] font-medium text-slate-500 pb-1.5"
          >
            回放
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="text-xs text-slate-500 mb-3">
          共 {channels.length} 条频道
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3 opacity-25">📺</div>
            <p className="text-sm text-slate-400">还没有频道</p>
            <button
              onClick={openCreate}
              className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm"
            >
              新增第一个
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-xl border border-slate-100 p-3.5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span>{ch.leagueIcon}</span>
                      <span className="text-[11px] text-slate-500">
                        {ch.league}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          ch.status === 'live'
                            ? 'bg-red-50 text-red-500'
                            : ch.status === 'upcoming'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {ch.status === 'live'
                          ? '直播中'
                          : ch.status === 'upcoming'
                          ? '即将'
                          : '回放'}
                      </span>
                    </div>
                    <p className="text-[14px] font-medium text-slate-800 mt-1 truncate">
                      {ch.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEdit(ch)}
                      className="px-3 py-1.5 text-[12px] text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => remove(ch.id)}
                      className="px-3 py-1.5 text-[12px] text-red-500 border border-red-100 rounded-full hover:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 truncate font-mono">
                  {ch.streamUrl || '未配置源'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {editing ? '编辑频道' : '新增频道'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Field label="名称">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="英超 · 利物浦 vs 曼城"
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="联赛">
                  <input
                    value={form.league}
                    onChange={(e) => setForm({ ...form, league: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="图标">
                  <input
                    value={form.leagueIcon}
                    onChange={(e) =>
                      setForm({ ...form, leagueIcon: e.target.value })
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="主队">
                  <input
                    value={form.home}
                    onChange={(e) => setForm({ ...form, home: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="客队">
                  <input
                    value={form.away}
                    onChange={(e) => setForm({ ...form, away: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Field label="主队比分">
                  <input
                    type="number"
                    value={form.homeScore}
                    onChange={(e) =>
                      setForm({ ...form, homeScore: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="客队比分">
                  <input
                    type="number"
                    value={form.awayScore}
                    onChange={(e) =>
                      setForm({ ...form, awayScore: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="分钟">
                  <input
                    type="number"
                    value={form.minute}
                    onChange={(e) => setForm({ ...form, minute: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              <Field label="状态">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as any })
                  }
                  className="input"
                >
                  <option value="live">直播中</option>
                  <option value="upcoming">即将开始</option>
                  <option value="replay">回放</option>
                </select>
              </Field>

              <Field label="流地址（m3u8）">
                <input
                  value={form.streamUrl}
                  onChange={(e) =>
                    setForm({ ...form, streamUrl: e.target.value })
                  }
                  placeholder="https://example.com/live.m3u8"
                  className="input font-mono text-[12px]"
                />
              </Field>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-5 py-3 flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm"
              >
                取消
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-medium"
              >
                {saving ? '保存中…' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          font-size: 13px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b;
          outline: none;
        }
        .input:focus {
          border-color: #059669;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium text-slate-700 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}