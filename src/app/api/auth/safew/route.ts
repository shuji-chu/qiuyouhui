import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifySafeWLogin } from '@/lib/safew';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const botToken = process.env.SAFEW_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: 'SafeW 未配置' }, { status: 500 });
    }

    const verified = verifySafeWLogin(body, botToken);
    if (!verified) {
      return NextResponse.json({ error: 'SafeW 授权验证失败' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { safewId: String(verified.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          safewId: String(verified.id),
          safewUsername: verified.username,
          firstName: verified.firstName,
          lastName: verified.lastName,
          photoUrl: verified.photoUrl,
          displayName:
            verified.username ||
            verified.firstName ||
            `用户${verified.id}`,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          safewUsername: verified.username,
          firstName: verified.firstName,
          lastName: verified.lastName,
          photoUrl: verified.photoUrl,
        },
      });
    }

    await createSession({
      userId: user.id,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
    });

    return NextResponse.json({
      ok: true,
      needsEmail: !user.email,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoUrl,
      },
    });
  } catch (err) {
    console.error('[safew]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}