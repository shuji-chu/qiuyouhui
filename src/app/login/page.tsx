'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Mode = 'login' | 'register';
type Step = 'email' | 'code';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendCode = async () => {
    if (!email) return setError('请输入邮箱');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '发送失败');
      setStep('code');
      setCountdown(60);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) return setError('请输入 6 位验证码');
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '验证失败');
      window.location.href = '/';
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const reset = (m: Mode) => {
    setMode(m);
    setStep('email');
    setCode('');
    setError('');
  };

  const safeLoginUrl = `https://oauth.safew.bot/auth?bot_id=${process.env.NEXT_PUBLIC_SAFEW_BOT_ID || ''}`;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[400px]">
        {/* Logo + 站点名 */}
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
            {mode === 'login' ? '登录以继续' : '创建新账号'}
          </p>
        </div>

        {/* 卡片 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab 切换 */}
          <div className="grid grid-cols-2 border-b border-slate-200">
            <button
              onClick={() => reset('login')}
              className={`py-3.5 text-sm font-medium transition relative ${
                mode === 'login'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              登录
              {mode === 'login' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
            <button
              onClick={() => reset('register')}
              className={`py-3.5 text-sm font-medium transition relative ${
                mode === 'register'
                  ? 'text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              注册
              {mode === 'register' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* 错误 */}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            {/* 第一步：邮箱 */}
            {step === 'email' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                  />
                </div>

                <button
                  onClick={sendCode}
                  disabled={loading || !email}
                  className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                >
                  {loading ? '发送中…' : '获取验证码'}
                </button>

                <p className="text-xs text-slate-400 text-center pt-1">
                  未注册的邮箱将自动创建账号
                </p>
              </>
            )}

            {/* 第二步：验证码 */}
            {step === 'code' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      验证码
                    </label>
                    <button
                      onClick={() => reset(mode)}
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      修改邮箱
                    </button>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                    placeholder="请输入 6 位验证码"
                    className="w-full h-11 px-3.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    验证码已发送至 {email}
                  </p>
                </div>

                <button
                  onClick={verifyCode}
                  disabled={loading || code.length !== 6}
                  className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                >
                  {loading ? '验证中…' : mode === 'login' ? '登录' : '完成注册'}
                </button>

                <button
                  onClick={sendCode}
                  disabled={countdown > 0}
                  className="w-full text-xs text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed transition"
                >
                  {countdown > 0 ? `${countdown}s 后可重新发送` : '没收到？重新发送'}
                </button>
              </>
            )}

            {/* 分隔线 */}
            <div className="relative pt-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400">
                  或
                </span>
              </div>
            </div>

            {/* SafeW 登录 */}
            <button
              onClick={() => {
                window.location.href = safeLoginUrl;
              }}
              className="w-full h-11 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg transition"
            >
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
              使用 SafeW 登录
            </button>
          </div>
        </div>

        {/* 底部 */}
        <p className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
          继续即表示同意
          <a className="text-slate-600 hover:text-slate-900 mx-1" href="#">
            服务条款
          </a>
          与
          <a className="text-slate-600 hover:text-slate-900 mx-1" href="#">
            隐私政策
          </a>
        </p>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-700 transition"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}