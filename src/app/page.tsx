'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useFavorites } from '@/hooks/useFavorites';
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
  minute: number | null;
  status: string;
  viewers: number;
}

const TOP_TABS = [
  { key: 'live', label: '直播中' },
  { key: 'upcoming', label: '今日赛程' },
  { key: 'replay', label: '往期回放' },
];

const LEAGUES = [
  { key: 'all', label: '全部' },
  { key: '英超', label: '英超' },
  { key: '西甲', label: '西甲' },
  { key: '意甲', label: '意甲' },
  { key: '德甲', label: '德甲' },
  { key: '法甲', label: '法甲' },
  { key: '欧冠', label: '欧冠' },
  { key: '德乙', label: '德乙' },
  { key: 'J联赛', label: '日韩' },
];

export default function HomePage() {
  const { user, loading, logout } = useUser();
  const { isFavorite, toggle } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState('live');
  const [league, setLeague] = useState('all');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);
    const p = new URLSearchParams();
    p.set('status', tab);
    if (league !== 'all') p.set('league', league);
    fetch(`/api/channels?${p}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.ok) setChannels(d.channels);
      })
      .finally(() => !cancelled && setFetching(false));
    return () => {
      cancelled = true;
    };
  }, [tab, league]);

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-9 h-9 rounded-full" />
            <div className="leading-none">
              <div className="text-[16px] font-bold text-slate-800 leading-tight">
                球友会
              </div>
              <div className="text-[9px] text-emerald-600 tracking-[0.15em] mt-0.5">
                QYH.VIP
              </div>
            </div>
          </Link>

          {loading ? (
            <div className="w-20 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)}>
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="" className="w-9 h-9 rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-semibold text-white">
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
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      个人中心
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-t border-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      我的收藏
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-50 border-t border-slate-100"
                    >
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-emerald-600 text-white"
              >
                登录
              </Link>
              <Link
                href="/login?mode=register"
                className="px-4 py-1.5 text-sm font-medium rounded-full bg-slate-100 text-slate-700"
              >
                注册
              </Link>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-2.5">
          <div className="flex gap-2">
            {TOP_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 py-2 rounded-full text-[13px] font-medium transition ${
                  tab === t.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-4 overflow-x-auto scrollbar-hide border-b border-slate-100">
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
        {fetching && (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-white border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!fetching && channels.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">⚽</div>
            <p className="text-sm text-slate-400">
              {tab === 'live' && '暂无正在进行的比赛'}
              {tab === 'upcoming' && '今日暂无赛程'}
              {tab === 'replay' && '暂无回放'}
            </p>
          </div>
        )}

        {!fetching && channels.length > 0 && (
          <div className="space-y-2.5">
            {channels.map((ch) => (
              <MatchCard
                key={ch.id}
                ch={ch}
                isFav={isFavorite(ch.id)}
                onToggleFav={() => toggle(ch.id)}
                isLoggedIn={!!user}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function MatchCard({
  ch,
  isFav,
  onToggleFav,
  isLoggedIn,
}: {
  ch: Channel;
  isFav: boolean;
  onToggleFav: () => void;
  isLoggedIn: boolean;
}) {
  const isLive = ch.status === 'live';
  const isReplay = ch.status === 'replay';

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('请先登录');
      return;
    }
    onToggleFav();
  };

  return (
    <Link
      href={`/live/${ch.id}`}
      className="block bg-white rounded-xl border border-slate-100 active:bg-slate-50 transition"
    >
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm">{ch.leagueIcon}</span>
          <span className="text-[11px] text-slate-500 truncate">{ch.league}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE {ch.minute != null && `${ch.minute}'`}
            </span>
          ) : isReplay ? (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              回放
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              即将
            </span>
          )}
          <button
            onClick={handleFav}
            className={`w-6 h-6 flex items-center justify-center transition ${
              isFav ? 'text-amber-400' : 'text-slate-300'
            }`}
            aria-label="收藏"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'}>
              <path
                d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[15px] text-slate-800 font-medium truncate">
            {ch.home || '主队'}
          </span>
          <span className="text-[18px] font-bold text-slate-900 tabular-nums">
            {ch.homeScore ?? '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-slate-800 font-medium truncate">
            {ch.away || '客队'}
          </span>
          <span className="text-[18px] font-bold text-slate-900 tabular-nums">
            {ch.awayScore ?? '-'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5c-5 0-9 4-9 7s4 7 9 7 9-4 9-7-4-7-9-7z"
              stroke="currentColor" strokeWidth="2"
            />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
          {formatViewers(ch.viewers)} 人观看
        </div>
        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
          {isLive ? '进入直播间' : isReplay ? '观看回放' : '查看详情'}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}