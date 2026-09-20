'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SafeWLoginButton } from '@/components/auth/SafeWLoginButton';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!email || !password) return setError('请填写邮箱和密码');

    if (mode === 'register') {
      if (password.length < 8) return setError('密码至少 8 位');
      if (!/[a-zA-Z]/.test(password)) return setError('密码需包含字母');
      if (!/\d/.test(password)) return setError('密码需包含数字');
    }

    setLoading(true);
    try {
      const url =
        mode === 'login' ? '/api/auth/login' : '/api/auth/register';
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

  const handleSafeWSuccess = () => {
    window.location.href = '/';
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="text-center mb-7">
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

          {/* SafeW 一键登录（最优先） */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <p className="text-xs font-medium text-slate-700 mb-3 text-center">
              一键登录
            </p>
            <SafeWLoginButton
              onSuccess={handleSafeWSuccess}
              onError={setError}
            />
          </div>

          {/* 分隔线 */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-slate-400">
                或使用邮箱
              </span>
            </div>
          </div>

          {/* 邮箱卡 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
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
              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder={
                    mode === 'register'
                      ? '至少 8 位，含字母和数字'
                      : '请输入密码'
                  }
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />
              </div>

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
          </div>

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