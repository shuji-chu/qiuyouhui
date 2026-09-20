import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyTelegramLogin } from '@/lib/telegram';
import { createSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json(
        { error: 'Telegram 未配置' },
        { status: 500 }
      );
    }

    const verified = verifyTelegramLogin(body, botToken);
    if (!verified) {
      return NextResponse.json(
        { error: 'Telegram 授权验证失败' },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: String(verified.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: String(verified.id),
          telegramUsername: verified.username,
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
          telegramUsername: verified.username,
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
    console.error('[telegram]', err);
    return NextResponse.json(
      { error: (err as Error).message || '服务器错误' },
      { status: 500 }
    );
  }
}