'use client';

import { use } from 'react';
import Link from 'next/link';

export default function ReplayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // 实际应从数据库拉，这里演示
  const videoId = id;

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href="/replay" className="text-slate-300">
            ← 返回
          </Link>
          <span className="text-sm">回放</span>
        </div>
      </header>
      <div className="aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    </main>
  );
}