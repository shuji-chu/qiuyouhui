'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Status = 'loading' | 'playing' | 'offline';

interface Props {
  roomId: string;
  title?: string;
  viewers?: number;
}

export function LivePreview({ roomId, title, viewers }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;
    let player: any = null;

    (async () => {
      try {
        const mod = await import('flv.js');
        const flvjs = (mod as any).default || mod;

        if (!flvjs.isSupported()) {
          setStatus('offline');
          return;
        }

        const url = `${window.location.protocol}//${window.location.hostname}/live/${roomId}.flv`;

        player = flvjs.createPlayer(
          { type: 'flv', url, isLive: true },
          { enableStashBuffer: false, stashInitialSize: 128 }
        );

        player.attachMediaElement(videoRef.current!);
        player.load();
        player.play().catch(() => {});

        player.on(flvjs.Events.ERROR, () => {
          if (!cancelled) setStatus('offline');
        });

        videoRef.current?.addEventListener('playing', () => {
          if (!cancelled) setStatus('playing');
        });
      } catch {
        setStatus('offline');
      }
    })();

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {}
    };
  }, [roomId]);

  return (
    <Link
      href={`/live/${roomId}`}
      className="block relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-lg shadow-slate-300/50 active:scale-[0.99] transition"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="w-full h-full object-cover"
      />

      {/* 未播放时的占位 */}
      {status !== 'playing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="text-4xl mb-2">⚽</div>
          <p className="text-xs text-slate-400">
            {status === 'loading' ? '正在连接…' : '暂未开播'}
          </p>
        </div>
      )}

      {/* LIVE 标识 */}
      {status === 'playing' && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 backdrop-blur text-white text-[10px] font-semibold px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      )}

      {/* 观看人数 */}
      {viewers != null && status === 'playing' && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full">
          {viewers} 人观看
        </div>
      )}

      {/* 底部渐变 + 标题 */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}
    </Link>
  );
}