'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: '直播', icon: LiveIcon },
  { href: '/replay', label: '回放', icon: ReplayIcon },
  { href: '/schedule', label: '赛程', icon: ScheduleIcon },
  { href: '/profile', label: '我的', icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2.5 gap-1 transition ${
                active ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <Icon active={active} />
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

function LiveIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="2" y="5" width="20" height="14" rx="3"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M10 9.5l5 2.5-5 2.5v-5z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={active ? 0 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReplayIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12" cy="12" r="9"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function ScheduleIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="3" y="5" width="18" height="16" rx="3"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12" cy="8" r="4"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M4 21c0-4 4-7 8-7s8 3 8 7"
        stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}