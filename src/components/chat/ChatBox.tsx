'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';
import { useUser } from '@/hooks/useUser';

export function ChatBox({ channelId }: { channelId: string }) {
  const { user, loading: userLoading } = useUser();
  const { messages, sending, connected, send } = useChat(
    channelId,
    !userLoading
  );

  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  // 检测用户是否滚到底部
  const onScroll = () => {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    autoScrollRef.current = atBottom;
  };

  // 新消息时自动滚到底部
  useEffect(() => {
    if (autoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content) return;
    setError('');
    setInput('');

    const res = await send(content);
    if (!res.ok) {
      setError(res.error || '发送失败');
      setInput(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* 顶栏 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? 'bg-emerald-400' : 'bg-slate-600'
            }`}
          />
          聊天室
        </span>
        <span className="text-[11px] text-slate-500">{messages.length} 条</span>
      </div>

      {/* 消息列表 */}
      <div
        ref={listRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5"
      >
        {messages.length === 0 && (
          <p className="text-center text-[12px] text-slate-600 py-8">
            还没有消息，来抢沙发吧
          </p>
        )}

        {messages.map((m) => (
          <MessageRow
            key={m.id}
            message={m}
            isMe={user?.id === m.user.id}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div className="border-t border-slate-800 p-3">
        {error && (
          <p className="text-[11px] text-red-400 mb-2">{error}</p>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={200}
              placeholder="说点什么…"
              className="flex-1 h-9 px-3 text-[13px] bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[13px] font-medium transition"
            >
              {sending ? '发送' : '发送'}
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="block text-center py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-[13px] text-slate-300 transition"
          >
            登录后参与聊天
          </Link>
        )}
      </div>
    </div>
  );
}

// ========== 单条消息 ==========
function MessageRow({
  message,
  isMe,
}: {
  message: any;
  isMe: boolean;
}) {
  return (
    <div className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
      {/* 头像 */}
      {message.user.avatar ? (
        <img
          src={message.user.avatar}
          alt=""
          className="w-7 h-7 rounded-full shrink-0"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
          {(message.user.name || '?')[0].toUpperCase()}
        </div>
      )}

      {/* 消息内容 */}
      <div className={`flex flex-col ${isMe ? 'items-end' : ''} max-w-[75%]`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] text-slate-500">
            {message.user.name}
          </span>
          <span className="text-[10px] text-slate-600">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div
          className={`px-3 py-1.5 rounded-2xl text-[13px] break-words ${
            isMe
              ? 'bg-emerald-600 text-white rounded-tr-sm'
              : 'bg-slate-800 text-slate-200 rounded-tl-sm'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}