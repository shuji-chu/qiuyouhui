'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

interface ReplayVideo {
  id: string;
  title: string;
  league: string;
  leagueIcon: string;
  home: string | null;
  away: string | null;
  score: string | null;
  videoId: string;
}

export default function ReplayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [item, setItem] = useState<ReplayVideo | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/replays/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setItem(d.item);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
        <div className="text-5xl opacity-40">🎬</div>
        <p className="text-sm text-slate-400">视频不存在</p>
        <Link href="/replay" className="text-sm text-emerald-400">
          ← 返回回放列表
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* 顶部 */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/replay" className="text-slate-300 flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            返回
          </Link>
          <span className="text-sm text-slate-400">回放</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* YouTube 播放器 */}
        <div className="relative aspect-video bg-black">
          {item ? (
            <iframe
              src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* 信息区 */}
        {item && (
          <div className="px-4 py-4 border-b border-slate-800">
            <h1 className="text-[15px] font-semibold">{item.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span>{item.leagueIcon}</span>
                <span>{item.league}</span>
              </span>
              {item.score && (
                <>
                  <span>·</span>
                  <span className="tabular-nums">{item.score}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="px-4 py-4">
          <Link
            href="/replay"
            className="block text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition"
          >
            返回更多回放
          </Link>
        </div>

        <div className="h-12" />
      </div>
    </main>
  );
}