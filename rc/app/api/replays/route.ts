import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const league = searchParams.get('league');

    const where: Record<string, string> = {};
    if (league && league !== 'all') where.league = league;

    const items = await prisma.replayVideo.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    });

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error('[replays]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}