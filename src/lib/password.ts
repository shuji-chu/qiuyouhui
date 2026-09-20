import crypto from 'crypto';

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = 16384;
const SALT_LEN = 16;

// ---------- 哈希密码 ----------
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(SALT_LEN).toString('hex');
  const derived = await scrypt(password, salt);
  return `${salt}:${derived.toString('hex')}`;
}

// ---------- 验证密码 ----------
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;

  const derived = await scrypt(password, salt);
  const hashBuf = Buffer.from(hash, 'hex');

  if (hashBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(hashBuf, derived);
}

// ---------- 校验密码强度 ----------
export function checkPasswordStrength(password: string): string | null {
  if (password.length < 8) return '密码至少 8 位';
  if (password.length > 72) return '密码太长';
  if (!/[a-zA-Z]/.test(password)) return '密码需包含字母';
  if (!/\d/.test(password)) return '密码需包含数字';
  return null;
}

// ---------- 内部：scrypt 封装 ----------
function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { cost: SCRYPT_COST },
      (err, key) => {
        if (err) reject(err);
        else resolve(key as Buffer);
      }
    );
  });
}