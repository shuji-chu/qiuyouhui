'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';

interface ReplayVideo {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  home: string | null;
  away: string | null;
  score: string | null;
  videoId: string;
}

const EMPTY = {
  title: '',
  league: '英超',
  leagueIcon: '🏴',
  home: '',
  away: '',
  score: '',
  videoId: '',
};

export default function AdminReplaysPage() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const [items, setItems] = useState<ReplayVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ReplayVideo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/admin/replays')
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userLoading) return;
    if (user && isAdmin) load();
    else setLoading(false);
  }, [userLoading, user, isAdmin]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: ReplayVideo) => {
    setEditing(item);
    setForm({
      title: item.title,
      league: item.league,
      leagueIcon: item.leagueIcon,
      home: item.home || '',
      away: item.away || '',
      score: item.score || '',
      videoId: item.videoId,
    });
    setError('');
    setShowForm(true);
  };

  const submit = async () => {
    setError('');
    if (!form.title.trim()) return setError('请填标题');
    if (!form.videoId.trim()) return setError('请填 YouTube 视频 ID');

    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      league: form.league.trim(),
      leagueIcon: form.leagueIcon.trim() || '⚽',
      home: form.home.trim() || null,
      away: form.away.trim() || null,
      score: form.score.trim() || null,
      videoId: form.videoId.trim(),
    };

    try {
      const url = editing
        ? `/api/admin/replays/${editing.id}`
        : '/api/admin/replays';
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
    if (!confirm('确定删除这条回放？')) return;
    await fetch(`/api/admin/replays/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
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
            <h1 className="text-base font-semibold text-slate-800">回放管理</h1>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            + 新增
          </button>
        </div>

        {/* Tab */}
        <div className="max-w-4xl mx-auto px-4 flex gap-4 pb-2.5">
          <Link
            href="/admin"
            className="text-[13px] font-medium text-slate-500 pb-1.5"
          >
            频道
          </Link>
          <Link
            href="/admin/replays"
            className="text-[13px] font-medium text-emerald-600 pb-1.5 relative"
          >
            回放
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-emerald-600 rounded-full" />
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <div className="text-xs text-slate-500 mb-3">
          共 {items.length} 条回放
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-white border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3 opacity-25">🎬</div>
            <p className="text-sm text-slate-400">还没有回放</p>
            <button
              onClick={openCreate}
              className="mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm"
            >
              新增第一个
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-100 p-3 flex gap-3"
              >
                <img
                  src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                  alt=""
                  className="w-24 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-800 truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.leagueIcon} {item.league}
                    {item.score && ` · ${item.score}`}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1 font-mono truncate">
                    {item.videoId}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 justify-center">
                  <button
                    onClick={() => openEdit(item)}
                    className="px-3 py-1 text-[11px] text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    className="px-3 py-1 text-[11px] text-red-500 border border-red-100 rounded-full hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 表单 */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-800">
                {editing ? '编辑回放' : '新增回放'}
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

              <Field label="标题">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="英超 曼联 1-3 切尔西"
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

              <div className="grid grid-cols-3 gap-3">
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
                <Field label="比分">
                  <input
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    placeholder="1-3"
                    className="input"
                  />
                </Field>
              </div>

              <Field label="YouTube 视频 ID">
                <input
                  value={form.videoId}
                  onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                  placeholder="dQw4w9WgXcQ"
                  className="input font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  从 YouTube URL 的 <code>watch?v=</code> 后面复制
                </p>
              </Field>

              {form.videoId && (
                <div className="rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={`https://img.youtube.com/vi/${form.videoId}/mqdefault.jpg`}
                    alt="预览"
                    className="w-full"
                  />
                </div>
              )}
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