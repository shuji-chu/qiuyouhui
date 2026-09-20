'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

interface ReplayVideo {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  home: string | null;
  away: string | null;
  score: string | null;
  videoId: string;
  publishedAt: string;
}

const LEAGUES = [
  { key: 'all', label: '全部' },
  { key: '英超', label: '英超' },
  { key: '西甲', label: '西甲' },
  { key: '意甲', label: '意甲' },
  { key: '德甲', label: '德甲' },
  { key: '法甲', label: '法甲' },
  { key: '欧冠', label: '欧冠' },
];

export default function ReplayPage() {
  const [league, setLeague] = useState('all');
  const [items, setItems] = useState<ReplayVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const p = new URLSearchParams();
    if (league !== 'all') p.set('league', league);
    fetch(`/api/replays?${p}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.ok) setItems(d.items);
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
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-video rounded-lg bg-white border border-slate-100 animate-pulse" />
                <div className="h-3 bg-white rounded animate-pulse w-3/4" />
              </div>
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
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/replay/${item.id}`}
                className="group block"
              >
                {/* 缩略图 */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  {/* 播放按钮 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* 联赛标签 */}
                  <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span>{item.leagueIcon}</span>
                    <span>{item.league}</span>
                  </div>
                  {/* 时长占位 */}
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
                    回放
                  </div>
                </div>

                {/* 标题 */}
                <p className="text-[12px] text-slate-800 leading-snug mt-1.5 line-clamp-2 font-medium">
                  {item.title}
                </p>
                {item.score && (
                  <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                    {item.score}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}