'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
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

const STATUS_TABS = [
  { key: 'all', label: '全部' },
  { key: 'live', label: '正在直播' },
  { key: 'upcoming', label: '今日赛程' },
  { key: 'replay', label: '回放' },
];

const LEAGUE_TABS = [
  { key: 'all', label: '全部' },
  { key: '英超', label: '英超' },
  { key: '西甲', label: '西甲' },
  { key: '意甲', label: '意甲' },
  { key: '德甲', label: '德甲' },
  { key: '法甲', label: '法甲' },
  { key: '欧冠', label: '欧冠' },
  { key: '德乙', label: '德乙' },
  { key: 'J联赛', label: 'J联赛' },
  { key: 'K联赛', label: 'K联赛' },
];

export default function HomePage() {
  const { user, loading, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState('all');
  const [league, setLeague] = useState('all');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setFetching(true);

    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (league !== 'all') params.set('league', league);

    fetch(`/api/channels?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.ok) setChannels(data.channels);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, league]);

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      {/* ============ 顶部栏 ============ */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        {/* 品牌 + 用户 */}
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="球友会" className="w-9 h-9 rounded-full" />
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-slate-800">球友会</div>
              <div className="text-[9px] text-slate-400 tracking-wider">QYH.VIP</div>
            </div>
          </Link>

          {loading ? (
            <div className="w-20 h-8 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1.5"
              >
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
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
                className="px-5 py-1.5 text-sm font-medium rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
                登录
              </Link>
              <Link
                href="/login?mode=register"
                className="px-5 py-1.5 text-sm font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                注册
              </Link>
            </div>
          )}
        </div>

        {/* 状态 Tab */}
        <div className="max-w-3xl mx-auto px-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition ${
                status === t.key
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 联赛 Tab */}
        <div className="max-w-3xl mx-auto px-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
          {LEAGUE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setLeague(t.key)}
              className={`shrink-0 pb-1.5 text-[13px] font-medium transition relative ${
                league === t.key ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {t.label}
              {league === t.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ============ 内容 ============ */}
      <div className="max-w-3xl mx-auto px-4 pt-3">
        {/* 加载 */}
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

        {/* 空状态 */}
        {!fetching && channels.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4 opacity-30">🐼</div>
            <p className="text-sm text-slate-400">暂无赛事</p>
          </div>
        )}

        {/* 比赛列表 */}
        {!fetching && channels.length > 0 && (
          <div className="space-y-2.5">
            {channels.map((ch) => (
              <MatchRow key={ch.id} channel={ch} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

// ============ 比赛卡片 ============
function MatchRow({ channel }: { channel: Channel }) {
  const isLive = channel.status === 'live';
  const isReplay = channel.status === 'replay';
  const isUpcoming = channel.status === 'upcoming';

  return (
    <Link
      href={`/live/${channel.id}`}
      className="block bg-white rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition active:scale-[0.995]"
    >
      {/* 头部：联赛 + 状态 */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base shrink-0">{channel.leagueIcon}</span>
          <span className="text-[12px] text-slate-500 truncate">{channel.league}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
          {isReplay && (
            <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              回放
            </span>
          )}
          {isUpcoming && (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              预告
            </span>
          )}
        </div>
      </div>

      {/* 队名 + 比分 */}
      <div className="px-3.5 pb-3">
        <div className="flex items-center justify-between py-1">
          <span className="text-[14px] text-slate-800 font-medium truncate">
            {channel.home || '主队'}
          </span>
          <span className="text-[17px] font-bold text-slate-900 tabular-nums">
            {channel.homeScore ?? '-'}
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[14px] text-slate-800 font-medium truncate">
            {channel.away || '客队'}
          </span>
          <span className="text-[17px] font-bold text-slate-900 tabular-nums">
            {channel.awayScore ?? '-'}
          </span>
        </div>
      </div>

      {/* 底部：状态 + 观看数 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-slate-50 bg-slate-50/50 rounded-b-xl">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          {isLive && channel.minute != null && <span>{channel.minute}'</span>}
          {isReplay && <span>已结束</span>}
          {isUpcoming && <span>即将开始</span>}
          {isLive && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5c-5 0-9 4-9 7s4 7 9 7 9-4 9-7-4-7-9-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              </svg>
              {formatViewers(channel.viewers)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
          {isLive && <span>进入直播</span>}
          {isReplay && <span>观看回放</span>}
          {isUpcoming && <span>预约提醒</span>}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}