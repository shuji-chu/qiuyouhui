'use client';

import { useEffect, useRef } from 'react';

interface Props {
  onSuccess?: (data: any) => void;
  onError?: (msg: string) => void;
}

export function SafeWLoginButton({ onSuccess, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // 唯一的回调函数名，避免多个组件冲突
    const cbName = `onSafeWAuth_${Math.random().toString(36).slice(2)}`;
    callbackRef.current = cbName;

    // 挂到 window 上，Widget 才能找到
    (window as any)[cbName] = async (user: any) => {
      try {
        const res = await fetch('/api/auth/safew', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          onError?.(data.error || '登录失败');
          return;
        }
        onSuccess?.(data);
      } catch (e) {
        onError?.((e as Error).message || '网络错误');
      }
    };

    // 插入 SafeW 官方脚本
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://oauth.safew.bot/js/safew-widget.js';
    script.setAttribute('data-safew-login', 'SplitwiseBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', `${cbName}(user)`);
    script.setAttribute('data-request-access', 'write');

    containerRef.current.appendChild(script);

    return () => {
      delete (window as any)[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [onSuccess, onError]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center min-h-[50px]"
    />
  );
}