import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

// 获取我的收藏
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ ok: true, items: [] });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.userId },
      include: { channel: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      ok: true,
      items: favorites.map((f) => ({
        id: f.id,
        createdAt: f.createdAt,
        channel: f.channel,
      })),
    });
  } catch (err) {
    console.error('[favorites GET]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

// 添加收藏
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { channelId } = await req.json();
    if (!channelId) {
      return NextResponse.json({ error: '缺少 channelId' }, { status: 400 });
    }

    await prisma.favorite.upsert({
      where: {
        userId_channelId: { userId: session.userId, channelId },
      },
      update: {},
      create: { userId: session.userId, channelId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[favorites POST]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

// 取消收藏
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');
    if (!channelId) {
      return NextResponse.json({ error: '缺少 channelId' }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { userId: session.userId, channelId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[favorites DELETE]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}