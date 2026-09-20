'use client';

import { useState } from 'react';
import Link from 'next/link';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');

    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    if (mode === 'register') {
      if (password.length < 8) {
        setError('密码至少 8 位');
        return;
      }
      if (!/[a-zA-Z]/.test(password)) {
        setError('密码需包含字母');
        return;
      }
      if (!/\d/.test(password)) {
        setError('密码需包含数字');
        return;
      }
    }

    setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '操作失败');
      window.location.href = '/';
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* 顶部品牌 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="球友会"
              className="w-14 h-14 rounded-xl mx-auto shadow-sm"
            />
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">
              球友会
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {mode === 'login' ? '登录以继续' : '创建你的账号'}
            </p>
          </div>

          {/* 卡片 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            {/* Tab */}
            <div className="grid grid-cols-2 border-b border-slate-200">
              <TabBtn
                active={mode === 'login'}
                onClick={() => switchMode('login')}
              >
                登录
              </TabBtn>
              <TabBtn
                active={mode === 'register'}
                onClick={() => switchMode('register')}
              >
                注册
              </TabBtn>
            </div>

            <div className="p-6 space-y-4">
              {/* 错误提示 */}
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              {/* 邮箱 */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />
              </div>

              {/* 密码 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    密码
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                      onClick={() => alert('忘记密码功能即将上线')}
                    >
                      忘记密码？
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder={
                    mode === 'register' ? '至少 8 位，含字母和数字' : '请输入密码'
                  }
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />
              </div>

              {/* 提交 */}
              <button
                onClick={submit}
                disabled={loading || !email || !password}
                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
              >
                {loading
                  ? mode === 'login'
                    ? '登录中…'
                    : '注册中…'
                  : mode === 'login'
                  ? '登录'
                  : '注册并登录'}
              </button>

              {/* 提示 */}
              {mode === 'register' && (
                <p className="text-xs text-slate-400 text-center pt-1">
                  注册即表示同意
                  <Link href="/terms" className="text-slate-600 mx-1 hover:underline">
                    服务条款
                  </Link>
                  与
                  <Link href="/privacy" className="text-slate-600 mx-1 hover:underline">
                    隐私政策
                  </Link>
                </p>
              )}
            </div>

            {/* 分隔线 */}
            <div className="relative px-6">
              <div className="absolute inset-x-6 top-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400 -translate-y-1/2 inline-block">
                  或使用以下方式
                </span>
              </div>
            </div>

            {/* 第三方登录 */}
            <div className="p-6 pt-2 space-y-2.5">
              <ThirdPartyBtn
                icon={<SafeWIcon />}
                label="使用 SafeW 登录"
                onClick={() => alert('SafeW 登录即将开放')}
              />
              <ThirdPartyBtn
                icon={<TelegramIcon />}
                label="使用 Telegram 登录"
                onClick={() => alert('Telegram 登录即将开放')}
              />
            </div>
          </div>

          {/* 底部 */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-slate-700 transition"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------- 小组件 ----------

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative py-3.5 text-sm font-medium transition ${
        active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
      )}
    </button>
  );
}

function ThirdPartyBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg transition"
    >
      {icon}
      {label}
    </button>
  );
}

function SafeWIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#00b96b" />
      <path
        d="M8 12l3 3 5-6"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#229ED9" />
      <path
        d="M6.5 12l9.5-5.5-2 9.5-3-2-1.5 2v-2.5L6.5 12z"
        fill="#fff"
      />
    </svg>
  );
}