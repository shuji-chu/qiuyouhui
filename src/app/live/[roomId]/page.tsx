'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getChannel } from '@/config/channels';

type Status = 'loading' | 'playing' | 'offline' | 'error';

export default function LiveRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  const channel = getChannel(roomId);
  const streamUrl = channel?.url || '';

  useEffect(() => {
    if (!streamUrl) {
      setStatus('offline');
      return;
    }

    const v = videoRef.current;
    if (!v) return;

    let hls: any = null;
    let cancelled = false;

    (async () => {
      // Safari 原生支持 HLS
      if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = streamUrl;
        v.play().catch(() => {});
        v.addEventListener('playing', () => {
          if (!cancelled) setStatus('playing');
        });
        v.addEventListener('error', () => {
          if (!cancelled) setStatus('error');
        });
        return;
      }

      try {
        const mod = await import('hls.js');
        const Hls = (mod as any).default || mod;

        if (!Hls.isSupported()) {
          setStatus('error');
          return;
        }

        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          v.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal && !cancelled) setStatus('error');
        });
        v.addEventListener('playing', () => {
          if (!cancelled) setStatus('playing');
        });
      } catch {
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      try { hls?.destroy(); } catch {}
    };
  }, [streamUrl]);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded-full" />
            <span className="text-sm font-semibold">球友会</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'playing' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span className="text-slate-400">
              {status === 'playing'
                ? '直播中'
                : status === 'loading'
                ? '加载中'
                : status === 'offline'
                ? '未开播'
                : '出错了'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full h-full"
          />

          {status !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-center px-6">
              {status === 'loading' && (
                <>
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
                  <p className="text-sm text-slate-300">正在连接直播…</p>
                </>
              )}
              {status === 'offline' && (
                <>
                  <div className="text-4xl mb-3">📺</div>
                  <p className="text-sm text-slate-300">该频道暂未配置源</p>
                  <p className="text-xs text-slate-500 mt-2">
                    请在 channels.ts 中填入 m3u8 地址
                  </p>
                </>
              )}
              {status === 'error' && (
                <>
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-sm text-slate-300">播放失败</p>
                  <p className="text-xs text-slate-500 mt-2">
                    源可能已失效，请刷新或换频道
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-4 border-b border-slate-800">
          <h1 className="text-base font-semibold">
            {channel?.title || `直播间 · ${roomId}`}
          </h1>
          {channel && (
            <p className="text-xs text-slate-500 mt-1">
              {channel.leagueIcon} {channel.league}
              {channel.score && ` · ${channel.home} ${channel.score} ${channel.away}`}
            </p>
          )}
        </div>

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
