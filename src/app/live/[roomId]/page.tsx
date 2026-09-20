'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

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
  streamUrl: string | null;
  viewers: number;
}

type PlayStatus = 'loading' | 'playing' | 'offline' | 'error';

export default function LivePage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [playStatus, setPlayStatus] = useState<PlayStatus>('loading');
  const [notFound, setNotFound] = useState(false);

  // 拉频道信息
  useEffect(() => {
    fetch(`/api/channels/${roomId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setChannel(d.channel);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [roomId]);

  // 播放
  useEffect(() => {
    if (!channel?.streamUrl) {
      if (channel) setPlayStatus('offline');
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    let hls: any = null;
    let cancelled = false;

    (async () => {
      setPlayStatus('loading');

      // Safari 原生支持 HLS
      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = channel.streamUrl!;
        v.addEventListener('playing', () => {
          if (!cancelled) setPlayStatus('playing');
        });
        v.addEventListener('error', () => {
          if (!cancelled) setPlayStatus('error');
        });
        v.play().catch(() => {});
        return;
      }

      // 其他浏览器用 hls.js
      try {
        const mod = await import('hls.js');
        const Hls = (mod as any).default || mod;
        if (!Hls.isSupported()) {
          setPlayStatus('error');
          return;
        }

        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        hls.loadSource(channel.streamUrl!);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          v.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal && !cancelled) setPlayStatus('error');
        });
        v.addEventListener('playing', () => {
          if (!cancelled) setPlayStatus('playing');
        });
      } catch {
        setPlayStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      try { hls?.destroy(); } catch {}
    };
  }, [channel?.streamUrl]);

  const toggleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  if (notFound) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
        <div className="text-5xl opacity-40">⚽</div>
        <p className="text-sm text-slate-400">找不到该直播间</p>
        <Link href="/" className="text-sm text-emerald-400">
          ← 返回首页
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="text-slate-300 text-sm flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            返回
          </Link>
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                playStatus === 'playing'
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
            <span className="text-slate-400">
              {playStatus === 'playing' && '直播中'}
              {playStatus === 'loading' && '连接中'}
              {playStatus === 'offline' && '未开播'}
              {playStatus === 'error' && '出错了'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* 播放器 */}
        <div ref={wrapRef} className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full h-full"
          />

          {playStatus !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center px-6 pointer-events-none">
              {playStatus === 'loading' && (
                <>
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
                  <p className="text-sm text-slate-300">正在连接直播…</p>
                </>
              )}
              {playStatus === 'offline' && (
                <>
                  <div className="text-4xl mb-3">📺</div>
                  <p className="text-sm text-slate-300">暂未开播</p>
                </>
              )}
              {playStatus === 'error' && (
                <>
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-sm text-slate-300">播放失败</p>
                  <p className="text-xs text-slate-500 mt-2">
                    源可能已失效，请刷新重试
                  </p>
                </>
              )}
            </div>
          )}

          {/* 全屏按钮 */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-16 right-3 px-3 py-1.5 bg-black/60 backdrop-blur text-white text-xs rounded hover:bg-black/80"
          >
            全屏
          </button>
        </div>

        {/* 比分栏 */}
        {channel && (
          <div className="px-4 py-4 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
              <span>{channel.leagueIcon}</span>
              <span>{channel.league}</span>
              {channel.status === 'live' && channel.minute != null && (
                <>
                  <span>·</span>
                  <span className="text-red-400">{channel.minute}'</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <div className="text-base font-semibold truncate">
                  {channel.home}
                </div>
              </div>
              <div className="px-6">
                <div className="text-3xl font-bold tabular-nums">
                  {channel.homeScore ?? '-'} : {channel.awayScore ?? '-'}
                </div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-base font-semibold truncate">
                  {channel.away}
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
              {channel.viewers} 人正在观看
            </div>
          </div>
        )}

        {/* 聊天区 */}
        <div className="px-4 py-4">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 text-center text-xs text-slate-500">
            登录后即可参与聊天
          </div>
        </div>

        <div className="h-12" />
      </div>
    </main>
  );
}