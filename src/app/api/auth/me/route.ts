import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { ok: false, user: null },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        photoUrl: true,
        role: true,
      },
    });

    if (!user) {
      // 会话有效但用户已删（极端情况）
      return NextResponse.json(
        { ok: false, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json(
      { ok: false, user: null, error: (err as Error).message },
      { status: 500 }
    );
  }
}