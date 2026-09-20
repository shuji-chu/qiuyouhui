import { getSession } from './session';
import { prisma } from './db';

// 从环境变量读管理员邮箱（逗号分隔）
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  // 1. 检查邮箱白名单
  if (session.email && ADMIN_EMAILS.includes(session.email.toLowerCase())) {
    return true;
  }

  // 2. 检查数据库里的 role
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  return user?.role === 'ADMIN';
}