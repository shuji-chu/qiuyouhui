'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Step = 'email' | 'code';

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 倒计时
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
      // 登录成功
      window.location.href = '/';
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="球友会"
            className="w-16 h-16 rounded-full mb-3"
          />
          <h1 className="text-xl font-semibold">球友会</h1>
        </div>

        {/* 卡片 */}
        <div className="rounded-2xl bg-card border border-line p-6">
          <div className="mb-5">
            <h2 className="text-base font-medium mb-1">
              {step === 'email' ? '邮箱登录' : '输入验证码'}
            </h2>
            <p className="text-xs text-muted">
              {step === 'email'
                ? '输入邮箱，我们会发送 6 位验证码'
                : `验证码已发送至 ${email}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-line rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-brand transition mb-4"
              />
              <button
                onClick={sendCode}
                disabled={loading || !email}
                className="w-full bg-brand hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-3 transition"
              >
                {loading ? '发送中…' : '发送验证码'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                placeholder="000000"
                className="w-full bg-black/40 border border-line rounded-lg px-4 py-3 text-2xl text-center tracking-[0.5em] text-white placeholder-neutral-700 focus:outline-none focus:border-brand transition mb-4"
              />
              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-brand hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-3 transition"
              >
                {loading ? '验证中…' : '登录'}
              </button>

              <div className="flex items-center justify-between mt-4 text-xs">
                <button
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setError('');
                  }}
                  className="text-muted hover:text-white transition"
                >
                  换个邮箱
                </button>
                <button
                  onClick={sendCode}
                  disabled={countdown > 0}
                  className="text-brand disabled:text-muted disabled:cursor-not-allowed transition"
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '重新发送'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-muted hover:text-white transition">
            ← 返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}