import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const league = searchParams.get('league');

    const where: Record<string, string> = {};
    if (status && status !== 'all') where.status = status;
    if (league && league !== 'all') where.league = league;

    const channels = await prisma.channel.findMany({
      where,
      orderBy: [{ viewers: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ ok: true, channels });
  } catch (err) {
    console.error('[channels]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}