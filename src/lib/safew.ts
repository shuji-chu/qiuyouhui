// src/lib/safew.ts
import crypto from 'crypto';

// ---------- 类型 ----------
export interface SafeWUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface VerifiedSafeWUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  authDate: number;
}

// ---------- 常量 ----------
const MAX_AGE_SECONDS = 60 * 60; // 授权数据有效期 1 小时

// ---------- 主函数 ----------
/**
 * 验证 SafeW Login Widget 返回的数据
 * @param data 前端传来的原始数据
 * @param botToken SafeW Bot Token（从环境变量读，不要硬编码）
 * @returns 验证通过返回标准化用户对象，失败返回 null
 */
export function verifySafeWLogin(
  data: Record<string, unknown>,
  botToken: string
): VerifiedSafeWUser | null {
  if (!botToken) {
    throw new Error('SAFEW_BOT_TOKEN 未配置');
  }

  // 1. 提取 hash
  const receivedHash = typeof data.hash === 'string' ? data.hash : null;
  if (!receivedHash) return null;

  // 2. 复制数据并删除 hash
  const dataCopy: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'hash') continue;
    if (value === undefined || value === null) continue;
    dataCopy[key] = String(value);
  }

  // 3. 按字母顺序排序，拼成 data_check_string
  const dataCheckString = Object.keys(dataCopy)
    .sort()
    .map((key) => `${key}=${dataCopy[key]}`)
    .join('\n');

  // 4. secret_key = SHA256(botToken)
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  // 5. 计算 HMAC-SHA256
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // 6. 常量时间比较，防时序攻击
  if (!timingSafeEqualHex(computedHash, receivedHash)) {
    return null;
  }

  // 7. 校验 auth_date 不过期
  const authDate = Number(data.auth_date);
  if (!Number.isFinite(authDate)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > MAX_AGE_SECONDS) {
    return null;
  }

  // 8. 返回标准化用户对象
  return {
    id: Number(data.id),
    firstName: String(data.first_name ?? ''),
    lastName: data.last_name ? String(data.last_name) : undefined,
    username: data.username ? String(data.username) : undefined,
    photoUrl: data.photo_url ? String(data.photo_url) : undefined,
    authDate,
  };
}

// ---------- 辅助：常量时间比较 ----------
function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
