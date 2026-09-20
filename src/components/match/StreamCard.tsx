'use client';

import Link from 'next/link';
import type { StreamChannel } from '@/config/channels';

export function StreamCard({ ch }: { ch: StreamChannel }) {
  return (
    <Link
      href={`/live/${ch.id}`}
      className="block group"
    >
      {/* 缩略图区 */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        {ch.poster ? (
          <img
            src={ch.poster}
            alt={ch.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
            <span className="text-4xl mb-1">{ch.leagueIcon}</span>
            <span className="text-xs">{ch.league}</span>
          </div>
        )}

        {/* 左上角 LIVE */}
        {ch.status === 'live' && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}
        {ch.status === 'replay' && (
          <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">
            回放
          </div>
        )}
        {ch.status === 'upcoming' && (
          <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">
            预告
          </div>
        )}

        {/* 右下角在线人数 */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-black/50 backdrop-blur text-white text-[10px] px-1.5 py-0.5 rounded">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5c-5 0-9 4-9 7s4 7 9 7 9-4 9-7-4-7-9-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
          {formatViewers(ch.viewers)}
        </div>
      </div>

      {/* 信息区 */}
      <div className="pt-1.5">
        <p className="text-[13px] text-slate-800 leading-snug line-clamp-2 font-medium">
          {ch.title}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
            {ch.league}
          </span>
          {ch.score && (
            <span className="text-[11px] text-slate-500">
              {ch.home} {ch.score} {ch.away}
            </span>
          )}
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
