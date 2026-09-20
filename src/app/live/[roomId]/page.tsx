'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type PlayerStatus = 'loading' | 'playing' | 'offline' | 'error';

export default function LiveRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [showChat, setShowChat] = useState(true);

  const flvUrl =
    typeof window !== 'undefined'
      ? `http://${window.location.hostname}/live/${roomId}.flv`
      : '';

  useEffect(() => {
    if (!flvUrl) return;
    let cancelled = false;

    (async () => {
      const mod = await import('flv.js');
      const flvjs = (mod as any).default || mod;

      if (!flvjs.isSupported()) {
        setStatus('error');
        return;
      }

      const player = flvjs.createPlayer(
        { type: 'flv', url: flvUrl, isLive: true },
        { enableStashBuffer: false, stashInitialSize: 128 }
      );

      player.attachMediaElement(videoRef.current!);
      player.load();
      player.play().catch(() => {});

      player.on(flvjs.Events.ERROR, () => {
        if (!cancelled) setStatus('offline');
      });

      playerRef.current = player;

      const v = videoRef.current!;
      const onPlaying = () => !cancelled && setStatus('playing');
      const onWaiting = () => !cancelled && setStatus('loading');
      v.addEventListener('playing', onPlaying);
      v.addEventListener('waiting', onWaiting);

      return () => {
        v.removeEventListener('playing', onPlaying);
        v.removeEventListener('waiting', onWaiting);
      };
    })();

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {}
    };
  }, [flvUrl]);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="" className="w-7 h-7 rounded-full" />
            <span className="text-sm font-semibold">球友会</span>
          </Link>
          <div className="flex items-center gap-3">
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
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        {/* 播放器 */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            muted
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
                  <p className="text-sm text-slate-300">主播暂未开播</p>
                  <p className="text-xs text-slate-500 mt-2">
                    请稍后再来，或等待开播通知
                  </p>
                </>
              )}
              {status === 'error' && (
                <>
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-sm text-slate-300">
                    浏览器不支持播放该格式
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* 标题栏 */}
        <div className="px-4 py-4 border-b border-slate-800">
          <h1 className="text-base font-semibold">直播间 · {roomId}</h1>
          <p className="text-xs text-slate-500 mt-1">
            观看直播，和其他球迷一起聊球
          </p>
        </div>

        {/* 聊天区 */}
        <div className="border-b border-slate-800">
          <button
            onClick={() => setShowChat((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm text-slate-400 hover:bg-slate-800/50 transition"
          >
            <span>💬 聊天室</span>
            <span className="text-xs">{showChat ? '收起' : '展开'}</span>
          </button>

          {showChat && (
            <div className="px-4 pb-6">
              <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-6 text-center text-xs text-slate-500">
                登录后即可参与聊天
              </div>
            </div>
          )}
        </div>

        <div className="h-12" />
      </div>
    </main>
  );
}
