'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: number;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

const POLL_INTERVAL = 3000; // 3 秒轮询

export function useChat(channelId: string, enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);

  // 拉取消息
  const fetchMessages = useCallback(async () => {
    if (!channelId || !enabled) return;
    try {
      const p = new URLSearchParams({ channelId });
      if (lastTimeRef.current > 0) {
        p.set('after', String(lastTimeRef.current));
      }
      const res = await fetch(`/api/chat?${p}`);
      const data = await res.json();
      if (!data.ok) return;

      setConnected(true);

      if (data.messages.length > 0) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const newOnes = data.messages.filter((m: ChatMessage) => !ids.has(m.id));
          if (newOnes.length === 0) return prev;
          const merged = [...prev, ...newOnes];
          // 最多保留 200 条
          return merged.slice(-200);
        });

        // 更新最后时间
        const last = data.messages[data.messages.length - 1];
        if (last) lastTimeRef.current = last.createdAt;
      }
    } catch {
      setConnected(false);
    }
  }, [channelId, enabled]);

  // 发送消息（乐观更新）
  const send = useCallback(
    async (content: string) => {
      if (!channelId || !content.trim()) return { ok: false, error: '内容为空' };
      setSending(true);

      // 乐观插入
      const tempId = `temp-${Date.now()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        content: content.trim(),
        createdAt: Date.now(),
        user: { id: 'me', name: '我', avatar: null },
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId, content: content.trim() }),
        });
        const data = await res.json();

        if (!res.ok) {
          // 失败移除乐观消息
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
          return { ok: false, error: data.error || '发送失败' };
        }

        // 用真实数据替换
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
        lastTimeRef.current = Math.max(lastTimeRef.current, data.message.createdAt);

        return { ok: true };
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return { ok: false, error: '网络错误' };
      } finally {
        setSending(false);
      }
    },
    [channelId]
  );

  // 轮询
  useEffect(() => {
    if (!channelId || !enabled) return;

    fetchMessages();

    timerRef.current = setInterval(fetchMessages, POLL_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [channelId, enabled, fetchMessages]);

  return { messages, sending, connected, send };
}