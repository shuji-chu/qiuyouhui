import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateCode, sendVerifyCode } from '@/lib/email';

const schema = z.object({
  email: z.string().email('邮箱格式不正确'),
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

    const { email } = parsed.data;

    // 限流：60 秒内不允许重复发送
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.verifyCodeExpiry) {
      const sentAt = existing.verifyCodeExpiry.getTime() - 5 * 60 * 1000;
      const elapsed = Date.now() - sentAt;
      if (elapsed < 60 * 1000) {
        return NextResponse.json(
          { error: '发送太频繁，请稍后再试' },
          { status: 429 }
        );
      }
    }

    const code = generateCode();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.upsert({
      where: { email },
      update: {
        verifyCode: code,
        verifyCodeExpiry: expiry,
      },
      create: {
        email,
        verifyCode: code,
        verifyCodeExpiry: expiry,
      },
    });

    const result = await sendVerifyCode(email, code);
    if (!result.ok) {
      return NextResponse.json(
        { error: `发送失败：${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-code]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}