import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

// ============ 拉取消息 ============
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get('channelId');
    const after = searchParams.get('after');

    if (!channelId) {
      return NextResponse.json({ error: '缺少 channelId' }, { status: 400 });
    }

    const where: Record<string, unknown> = { channelId };
    if (after) {
      where.createdAt = { gt: new Date(Number(after)) };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    return NextResponse.json({
      ok: true,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        createdAt: m.createdAt.getTime(),
        user: {
          id: m.user.id,
          name: m.user.displayName || '匿名',
          avatar: m.user.photoUrl,
        },
      })),
    });
  } catch (err) {
    console.error('[chat GET]', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// ============ 发送消息 ============
const schema = z.object({
  channelId: z.string().min(1),
  content: z.string().min(1).max(200),
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
        { error: '消息内容不符合要求' },
        { status: 400 }
      );
    }

    const { channelId, content } = parsed.data;

    const message = await prisma.chatMessage.create({
      data: {
        userId: session.userId,
        channelId,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, displayName: true, photoUrl: true },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.getTime(),
        user: {
          id: message.user.id,
          name: message.user.displayName || '匿名',
          avatar: message.user.photoUrl,
        },
      },
    });
  } catch (err) {
    console.error('[chat POST]', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}