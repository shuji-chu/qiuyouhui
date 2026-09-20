import crypto from 'crypto';

const MAX_AGE_SECONDS = 60 * 60; // 授权 1 小时内有效

export interface VerifiedTelegramUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  authDate: number;
}

export function verifyTelegramLogin(
  data: Record<string, unknown>,
  botToken: string
): VerifiedTelegramUser | null {
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN 未配置');
  }

  const receivedHash = typeof data.hash === 'string' ? data.hash : null;
  if (!receivedHash) return null;

  const dataCopy: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'hash') continue;
    if (value === undefined || value === null) continue;
    dataCopy[key] = String(value);
  }

  // 按字母排序拼接
  const dataCheckString = Object.keys(dataCopy)
    .sort()
    .map((key) => `${key}=${dataCopy[key]}`)
    .join('\n');

  // Telegram 用 SHA256(bot_token) 作为 HMAC 密钥
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (!timingSafeEqualHex(computedHash, receivedHash)) return null;

  const authDate = Number(data.auth_date);
  if (!Number.isFinite(authDate)) return null;
  if (Math.floor(Date.now() / 1000) - authDate > MAX_AGE_SECONDS) return null;

  return {
    id: Number(data.id),
    firstName: String(data.first_name ?? ''),
    lastName: data.last_name ? String(data.last_name) : undefined,
    username: data.username ? String(data.username) : undefined,
    photoUrl: data.photo_url ? String(data.photo_url) : undefined,
    authDate,
  };
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}