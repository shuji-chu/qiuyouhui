'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useFavorites } from '@/hooks/useFavorites';
import { BottomNav } from '@/components/layout/BottomNav';

interface FavItem {
  id: string;
  channel: {
    id: string;
    name: string;
    league: string;
    leagueIcon: string;
    home: string | null;
    away: string | null;
    homeScore: number | null;
    awayScore: number | null;
    status: string;
  };
}

export default function FavoritesPage() {
  const { user, loading: userLoading } = useUser();
  const { toggle } = useFavorites();
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userLoading) return;
    load();
  }, [userLoading]);

  const removeFav = async (channelId: string) => {
    await toggle(channelId);
    setItems((prev) => prev.filter((i) => i.channel.id !== channelId));
  };

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/profile" className="text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </Link>
          <h1 className="text-base font-semibold text-slate-800">我的收藏</h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-3">
        {userLoading || loading ? (
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : !user ? (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">⭐</div>
            <p className="text-sm text-slate-400 mb-4">登录后可收藏比赛</p>
            <Link
              href="/login"
              className="inline-block px-5 py-2 rounded-full bg-emerald-600 text-white text-sm"
            >
              去登录
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">⭐</div>
            <p className="text-sm text-slate-400">还没有收藏任何比赛</p>
            <Link
              href="/"
              className="inline-block mt-4 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm"
            >
              去逛逛
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => {
              const ch = item.channel;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-100 p-3.5 flex items-center gap-3"
                >
                  <Link href={`/live/${ch.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                      <span>{ch.leagueIcon}</span>
                      <span>{ch.league}</span>
                    </div>
                    <p className="text-[14px] font-medium text-slate-800 truncate">
                      {ch.home} vs {ch.away}
                    </p>
                    <p className="text-[13px] font-bold text-slate-900 mt-0.5 tabular-nums">
                      {ch.homeScore ?? '-'} : {ch.awayScore ?? '-'}
                    </p>
                  </Link>
                  <button
                    onClick={() => removeFav(ch.id)}
                    className="px-3 py-1.5 text-[11px] text-slate-400 border border-slate-200 rounded-full hover:bg-slate-50"
                  >
                    取消
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}