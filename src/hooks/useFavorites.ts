'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'qyh_favorites';

export function useFavorites() {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  // 初始化：从服务端拉，失败用 localStorage
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        if (cancelled) return;
        if (data.ok && Array.isArray(data.items)) {
          setIds(new Set(data.items.map((i: any) => i.channel.id)));
        } else {
          loadFromLocal();
        }
      } catch {
        loadFromLocal();
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    function loadFromLocal() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setIds(new Set(JSON.parse(raw)));
      } catch {}
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {}
  }, []);

  const toggle = useCallback(
    async (channelId: string) => {
      const has = ids.has(channelId);
      const next = new Set(ids);

      if (has) {
        next.delete(channelId);
      } else {
        next.add(channelId);
      }

      setIds(next);
      persist(next);

      try {
        if (has) {
          await fetch(`/api/favorites?channelId=${channelId}`, {
            method: 'DELETE',
          });
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId }),
          });
        }
      } catch {
        // 网络失败时保持本地状态，下次同步
      }
    },
    [ids, persist]
  );

  const isFavorite = useCallback(
    (channelId: string) => ids.has(channelId),
    [ids]
  );

  return { ids, loaded, toggle, isFavorite };
}