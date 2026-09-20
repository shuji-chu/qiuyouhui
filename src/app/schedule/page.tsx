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
  status: string;
  startAt: string | null;
}

export default function SchedulePage() {
  const [items, setItems] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/channels?status=upcoming')
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.channels))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-800">今日赛程</h1>
          <span className="text-[11px] text-slate-400">北京时间</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-3">
        {loading && (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-4xl mb-3 opacity-25">📅</div>
            <p className="text-sm text-slate-400">今日暂无赛程</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((ch) => (
              <div
                key={ch.id}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2.5">
                  <span>{ch.leagueIcon}</span>
                  <span>{ch.league}</span>
                  <span className="ml-auto text-emerald-600 font-medium">
                    即将开始
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 text-right">
                    <span className="text-[14px] font-medium text-slate-800">
                      {ch.home}
                    </span>
                  </div>
                  <div className="text-slate-300 text-sm">vs</div>
                  <div className="flex-1 text-left">
                    <span className="text-[14px] font-medium text-slate-800">
                      {ch.away}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">时间待定</span>
                  <Link
                    href={`/live/${ch.id}`}
                    className="text-[12px] text-emerald-600 font-medium"
                  >
                    查看详情 ›
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}