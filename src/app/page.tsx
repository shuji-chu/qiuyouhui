'use client';

import Link from 'next/link';
import { useState } from 'react';
import { groupLeagues } from '@/config/leagues';
import { useUser } from '@/hooks/useUser';
import { BottomNav } from '@/components/layout/BottomNav';
import { LivePreview } from '@/components/match/LivePreview';

export default function HomePage() {
  const { user, loading, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const leagueGroups = groupLeagues();

  return (
    <main className="min-h-screen pb-20">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-30 glass border-b border-white/40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="球友会" className="w-8 h-8 rounded-full" />
            <span className="text-base font-semibold text-slate-800">球友会</span>
          </div>

          {loading ? (
            <div className="w-16 h-7 rounded-full bg-slate-200/60 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/60 transition"
              >
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm max-w-[100px] truncate text-slate-700">
                  {user.displayName || user.email || '未绑定邮箱'}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
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
              className="text-sm px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm"
            >
              登录
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* 正在直播 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              正在直播
            </h2>
            <Link
              href="/live"
              className="text-xs text-slate-400 hover:text-slate-700 transition"
            >
              全部 ›
            </Link>
          </div>

          <LivePreview
            roomId="streamkey"
            title="英超 · 利物浦 vs 曼城"
            viewers={1243}
          />
        </section>

        {/* 联赛分类 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-700">联赛分类</h2>
          </div>

          <div className="space-y-4">
            {leagueGroups.map(({ group, items }) => (
              <div key={group}>
                <div className="text-xs text-slate-400 mb-2">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/category/${l.slug}`}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition text-sm text-slate-700"
                    >
                      <span className="mr-1">{l.icon}</span>
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 今日比赛 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-700">今日比赛</h2>
            <span className="text-xs text-slate-400">北京时间</span>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-10 text-center shadow-sm">
            <div className="text-3xl mb-3">⚽</div>
            <div className="text-sm text-slate-500">暂无比赛数据</div>
            <div className="text-xs text-slate-400 mt-2">
              接入赛事数据后，这里会显示今日赛程
            </div>
          </div>
        </section>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </main>
  );
}