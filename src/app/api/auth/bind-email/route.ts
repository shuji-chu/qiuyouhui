import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession, createSession } from '@/lib/session';

const schema = z.object({
  email: z.string().email('邮箱格式不正确'),
  code: z.string().length(6, '验证码为 6 位数字'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;

    // 邮箱是否已被别人占用
    const occupied = await prisma.user.findUnique({ where: { email } });
    if (occupied && occupied.id !== session.userId) {
      return NextResponse.json(
        { error: '该邮箱已绑定其他账号' },
        { status: 400 }
      );
    }

    const record = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return NextResponse.json({ error: '请先获取验证码' }, { status: 400 });
    }
    if (new Date() > record.expires) {
      return NextResponse.json({ error: '验证码已过期' }, { status: 400 });
    }
    if (record.code !== code) {
      return NextResponse.json({ error: '验证码错误' }, { status: 400 });
    }

    await prisma.emailVerification.delete({ where: { id: record.id } });

    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        email,
        emailVerified: new Date(),
      },
    });

    await createSession({
      userId: user.id,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error('[bind-email]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}