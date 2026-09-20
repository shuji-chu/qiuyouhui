import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const schema = z.object({
  email: z.string().email('邮箱格式不正确'),
  code: z.string().length(6, '验证码为 6 位数字'),
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

    const { email, code } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.verifyCode || !user.verifyCodeExpiry) {
      return NextResponse.json(
        { error: '请先获取验证码' },
        { status: 400 }
      );
    }

    if (new Date() > user.verifyCodeExpiry) {
      return NextResponse.json(
        { error: '验证码已过期，请重新获取' },
        { status: 400 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { error: '验证码错误' },
        { status: 400 }
      );
    }

    const displayName =
      user.displayName || email.split('@')[0];

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyCode: null,
        verifyCodeExpiry: null,
        displayName,
      },
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        displayName,
      },
    });
  } catch (err) {
    console.error('[verify-code]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}