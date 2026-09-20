import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword, checkPasswordStrength } from '@/lib/password';
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

    // 密码强度
    const pwdErr = checkPasswordStrength(password);
    if (pwdErr) {
      return NextResponse.json({ error: pwdErr }, { status: 400 });
    }

    // 邮箱是否已注册
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.passwordHash) {
      return NextResponse.json(
        { error: '该邮箱已注册，请直接登录' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const displayName = email.split('@')[0];

    // 如果邮箱之前存在（SafeW/Telegram 用户），补上密码；否则新建
    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            emailVerified: new Date(),
            displayName: existing.displayName ?? displayName,
          },
        })
      : await prisma.user.create({
          data: {
            email,
            passwordHash,
            emailVerified: new Date(),
            displayName,
          },
        });

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
    console.error('[register]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}