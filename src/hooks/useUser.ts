'use client';

import { useEffect, useState, useCallback } from 'react';

export interface CurrentUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  role: 'USER' | 'ADMIN';
}

interface UseUserResult {
  user: CurrentUser | null;
  isAdmin: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      setUser(data.user ?? null);
      setIsAdmin(!!data.isAdmin);
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, isAdmin, loading, refresh, logout };
}