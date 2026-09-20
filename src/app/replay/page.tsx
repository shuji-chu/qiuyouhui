'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

interface Channel {
  id: string;
  name: string;
  league: string;
  leagueIcon: string;
  home: string | null;
  away: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  viewers: number;
}

const LEAGUES = [
  { key: 'all', label: '全部' },
  { key: '英超', label: '英超' },
  { key: '西甲', label: '西甲' },
  { key: '意甲', label: '意甲' },
  { key: '德甲', label: '德甲' },
  { key: '欧冠', label: '欧冠' },
];

export default function ReplayPage() {
  const [league, setLeague] = useState('all');
  const [items, setItems] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const p = new URLSearchParams({ status: 'replay' });
    if (league !== 'all') p.set('league', league);
    fetch(`/api/channels?${p}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.ok) setItems(d.channels);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [league]);

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <h1 className="text-base font-semibold text-slate-800">往期回放</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-4 overflow-x-auto scrollbar-hide">
          {LEAGUES.map((l) => (
            <button
              key={l.key}
              onClick={() => setLeague(l.key)}
              className={`shrink-0 text-[13px] font-medium pb-1 relative transition ${
                league === l.key ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {l.label}
              {league === l.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-3">
        {loading && (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">🎬</div>
            <p className="text-sm text-slate-400">暂无回放</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((ch) => (
              <Link
                key={ch.id}
                href={`/live/${ch.id}`}
                className="flex gap-3 bg-white rounded-xl border border-slate-100 p-3 active:bg-slate-50 transition"
              >
                {/* 缩略图占位 */}
                <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 shrink-0 flex items-center justify-center relative">
                  <span className="text-2xl opacity-60">{ch.leagueIcon}</span>
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    回放
                  </div>
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-[13px] font-medium text-slate-800 truncate">
                    {ch.home} vs {ch.away}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {ch.leagueIcon} {ch.league}
                  </p>
                  <p className="text-[16px] font-bold text-slate-900 mt-1 tabular-nums">
                    {ch.homeScore} : {ch.awayScore}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatViewers(ch.viewers)} 人观看过
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}