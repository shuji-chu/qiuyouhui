import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/session';

const schema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // 用户不存在 或 没有设密码
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 400 }
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 400 }
      );
    }

    await createSession({
      userId: user.id,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}