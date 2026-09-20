'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { BottomNav } from '@/components/layout/BottomNav';

const MENU = [
  { href: '/favorites', label: '我的收藏', icon: StarIcon, color: 'emerald' },
  { href: '/history', label: '观看历史', icon: ClockIcon, color: 'sky' },
  { href: '/messages', label: '消息中心', icon: BellIcon, color: 'violet' },
  { href: '/settings', label: '设置', icon: GearIcon, color: 'slate' },
  { href: '/about', label: '关于我们', icon: InfoIcon, color: 'slate' },
];

const ICON_BG: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  slate: 'bg-slate-100 text-slate-600',
};

export default function ProfilePage() {
  const { user, isAdmin, loading, logout } = useUser();

  return (
    <main className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-base font-semibold text-slate-800">我的</span>
          <Link href="/settings" className="text-slate-400">
            <GearIcon />
          </Link>
        </div>
      </header>

      <div className="bg-white pb-6">
        <div className="max-w-3xl mx-auto px-4 pt-2">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-1/3" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.photoUrl ? (
                <img src={user.photoUrl} alt="" className="w-14 h-14 rounded-full" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-xl font-semibold text-white">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-slate-800 truncate">
                  {user.displayName || '未设置昵称'}
                </p>
                <p className="text-[12px] text-slate-400 truncate mt-0.5">
                  {user.email || '未绑定邮箱'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                👤
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-slate-700">未登录</p>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  登录后收藏比赛、参与讨论
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-[12px] rounded-full bg-emerald-600 text-white"
                >
                  登录
                </Link>
                <Link
                  href="/login?mode=register"
                  className="px-3.5 py-1.5 text-[12px] rounded-full bg-slate-100 text-slate-600"
                >
                  注册
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 管理后台入口（仅管理员）*/}
      {user && isAdmin && (
        <div className="max-w-3xl mx-auto px-4 mt-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 text-white active:opacity-90 transition"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3" y="4" width="18" height="16" rx="2"
                  stroke="currentColor" strokeWidth="1.8"
                />
                <path
                  d="M3 10h18M9 4v16"
                  stroke="currentColor" strokeWidth="1.8"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold">管理后台</p>
              <p className="text-[11px] text-white/70 mt-0.5">
                管理频道和回放视频
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-3">
            {MENU.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="flex flex-col items-center gap-2 py-5 active:bg-slate-50 transition"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${ICON_BG[m.color]}`}
                  >
                    <Icon />
                  </div>
                  <span className="text-[11px] text-slate-600">{m.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {user && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-xl bg-white border border-slate-100 text-[14px] text-red-500 font-medium active:bg-slate-50 transition"
          >
            退出登录
          </button>
        </div>
      )}

      <p className="text-center text-[11px] text-slate-300 mt-8">
        球友会 · v0.1.0
      </p>

      <BottomNav />
    </main>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 17V11a6 6 0 1112 0v6l1.5 2h-15L6 17z"
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
      />
      <path
        d="M10 21h4" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
        stroke="currentColor" strokeWidth="1.6"
      />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 11v5M12 8v.01" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}