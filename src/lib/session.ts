import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'qyh-dev-secret-2026';
const COOKIE_NAME = 'qyh_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 天

export interface SessionPayload {
  userId: string;
  email?: string;
  displayName?: string;
}

// ---------- base64url ----------
function b64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function b64urlDecode(input: string): Buffer {
  const pad = 4 - (input.length % 4);
  const padded = input + (pad < 4 ? '='.repeat(pad) : '');
  return Buffer.from(
    padded.replace(/-/g, '+').replace(/_/g, '/'),
    'base64'
  );
}

// ---------- 签发 JWT ----------
function signJWT(payload: object, maxAge: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + maxAge };

  const encHeader = b64url(JSON.stringify(header));
  const encPayload = b64url(JSON.stringify(fullPayload));
  const data = `${encHeader}.${encPayload}`;

  const sig = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest();

  return `${data}.${b64url(sig)}`;
}

// ---------- 验证 JWT ----------
function verifyJWT(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encHeader, encPayload, encSig] = parts;
  const data = `${encHeader}.${encPayload}`;

  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(data)
    .digest();
  const actualSig = b64urlDecode(encSig);

  if (expectedSig.length !== actualSig.length) return null;
  if (!crypto.timingSafeEqual(expectedSig, actualSig)) return null;

  try {
    const payload = JSON.parse(b64urlDecode(encPayload).toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return {
      userId: String(payload.userId),
      email: payload.email ? String(payload.email) : undefined,
      displayName: payload.displayName
        ? String(payload.displayName)
        : undefined,
    };
  } catch {
    return null;
  }
}

// ---------- 对外接口 ----------
export async function createSession(payload: SessionPayload) {
  const token = signJWT(payload, MAX_AGE);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
