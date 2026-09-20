'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/category/epl', label: '赛事', icon: '🏆' },
  { href: '/live', label: '直播', icon: '📺' },
  { href: '/messages', label: '消息', icon: '💬' },
  { href: '/profile', label: '我的', icon: '👤' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-2xl mx-auto grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2.5 gap-0.5 transition ${
                active ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className={`text-[10px] ${active ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}