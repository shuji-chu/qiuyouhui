'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MOCK_CHANNELS } from '@/data/mock';
import { BottomNav } from '@/components/layout/BottomNav';

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
];

export default function HomePage() {
  const [tab, setTab] = useState('live');
  const [league, setLeague] = useState('all');

  const filtered = MOCK_CHANNELS.filter((c) => {
    if (tab === 'replay') return false;
    if (c.status !== tab) return false;
    if (league !== 'all' && c.league !== league) return false;
    return true;
  });

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
        {tab === 'replay' ? (
          <ReplaySection />
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">⚽</div>
            <p className="text-sm text-slate-400">
              {tab === 'live' ? '暂无正在进行的比赛' : '今日暂无赛程'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((ch) => (
              <MatchCard key={ch.id} ch={ch} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}

function MatchCard({ ch }: { ch: (typeof MOCK_CHANNELS)[0] }) {
  const isLive = ch.status === 'live';

  return (
    <Link
      href={`/live/${ch.id}`}
      className="block bg-white rounded-xl border border-slate-100 overflow-hidden active:bg-slate-50 transition"
    >
      {/* 顶部彩条 */}
      <div
        className={`h-1 ${
          isLive
            ? 'bg-gradient-to-r from-red-500 to-rose-400'
            : 'bg-gradient-to-r from-emerald-500 to-teal-400'
        }`}
      />

      <div className="p-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{ch.leagueIcon}</span>
            <span className="text-[11px] text-slate-500 font-medium">
              {ch.league}
            </span>
          </div>
          {isLive ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE {ch.minute}'
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              即将开始
            </span>
          )}
        </div>

        {/* 对阵 + 比分 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-slate-800 font-medium">
              {ch.home}
            </span>
            <span className="text-[20px] font-bold text-slate-900 tabular-nums leading-none">
              {ch.homeScore ?? '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-slate-800 font-medium">
              {ch.away}
            </span>
            <span className="text-[20px] font-bold text-slate-900 tabular-nums leading-none">
              {ch.awayScore ?? '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5c-5 0-9 4-9 7s4 7 9 7 9-4 9-7-4-7-9-7z"
              stroke="currentColor" strokeWidth="2"
            />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
          {ch.viewers} 人观看
        </div>
        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
          进入直播间
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

function ReplaySection() {
  const replays = require('@/data/mock').MOCK_REPLAYS;
  return (
    <div className="grid grid-cols-2 gap-3">
      {replays.map((r: any) => (
        <Link key={r.id} href={`/replay/${r.id}`} className="block">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
            <img
              src={`https://img.youtube.com/vi/${r.videoId}/mqdefault.jpg`}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-[12px] text-slate-800 mt-1.5 truncate">
            {r.title}
          </p>
        </Link>
      ))}
    </div>
  );
}