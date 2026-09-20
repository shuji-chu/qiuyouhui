'use client';

import Link from 'next/link';
import { useState } from 'react';
import { groupLeagues } from '@/config/leagues';
import { useUser } from '@/hooks/useUser';

export default function HomePage() {
  const { user, loading, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const leagueGroups = groupLeagues();

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/60 border-b border-line">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="球友会" className="w-8 h-8 rounded-full" />
            <span className="text-base font-semibold">球友会</span>
          </div>

          {loading ? (
            <div className="w-16 h-7 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 transition"
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt=""
                    className="w-7 h-7 rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-xs font-semibold text-white">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-sm max-w-[100px] truncate">
                  {user.displayName || user.email}
                </span>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-xl bg-card border border-line overflow-hidden shadow-xl">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm hover:bg-white/5 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      个人中心
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition border-t border-line"
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
              className="text-sm px-4 py-1.5 rounded-full bg-brand hover:bg-brand-dark text-white transition"
            >
              登录
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 联赛分类 */}
        <section className="mb-8">
          <h2 className="text-sm text-muted mb-3">联赛分类</h2>
          <div className="space-y-4">
            {leagueGroups.map(({ group, items }) => (
              <div key={group}>
                <div className="text-xs text-muted mb-2">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/category/${l.slug}`}
                      className="px-3 py-1.5 rounded-full bg-card border border-line hover:border-brand transition text-sm"
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

        {/* 比赛列表 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm text-muted">今日比赛</h2>
            <span className="text-xs text-muted">北京时间</span>
          </div>

          <div className="rounded-2xl bg-card border border-line p-10 text-center">
            <div className="text-3xl mb-3">⚽</div>
            <div className="text-sm text-muted">暂无比赛数据</div>
            <div className="text-xs text-muted mt-2">
              接入赛事数据后，这里会显示今日赛程
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}