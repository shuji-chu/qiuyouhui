import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const channel = await prisma.channel.findUnique({ where: { id } });
    if (!channel) {
      return NextResponse.json(
        { ok: false, error: '频道不存在' },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    console.error('[channel]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}