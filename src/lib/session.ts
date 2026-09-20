import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-me-in-production-please'
);

const COOKIE_NAME = 'qyh_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 天

export interface SessionPayload {
  userId: string;
  email?: string;
  displayName?: string;
}

// ---------- 签发会话 ----------
export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

// ---------- 读取会话 ----------
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      userId: String(payload.userId),
      email: payload.email ? String(payload.email) : undefined,
      displayName: payload.displayName ? String(payload.displayName) : undefined,
    };
  } catch {
    return null;
  }
}

// ---------- 清除会话 ----------
export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}