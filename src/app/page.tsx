'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CHANNELS } from '@/config/channels';
import { useUser } from '@/hooks/useUser';
import { BottomNav } from '@/components/layout/BottomNav';
import { StreamCard } from '@/components/match/StreamCard';

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'live', label: '正在直播' },
  { key: 'football', label: '足球' },
  { key: 'basketball', label: '篮球' },
  { key: 'replay', label: '回放' },
];

export default function HomePage() {
  const { user, loading, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('all');

  const filtered = CHANNELS.filter((c) => {
    if (tab === 'all') return true;
    if (tab === 'live') return c.status === 'live';
    if (tab === 'replay') return c.status === 'replay';
    return c.category === tab;
  });

  return (
    <main className="min-h-screen pb-20">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="球友会" className="w-8 h-8 rounded-full" />
            <span className="text-base font-semibold text-slate-800 hidden sm:block">
              球友会
            </span>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索比赛、球队、主播"
                className="w-full h-9 bg-white/80 border border-slate-200 rounded-full pl-9 pr-4 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* 用户 */}
          {loading ? (
            <div className="w-16 h-7 rounded-full bg-slate-200/60 animate-pulse shrink-0" />
          ) : user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-full hover:bg-white/60 transition"
              >
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      个人中心
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-50 transition border-t border-slate-100"
                    >
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm shrink-0"
            >
              登录
            </Link>
          )}
        </div>

        {/* 分类 Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2 -mt-1 scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                tab === t.key
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* 卡片网格 */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-slate-400">
            暂无内容
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-5">
            {filtered.map((ch) => (
              <StreamCard key={ch.id} ch={ch} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
