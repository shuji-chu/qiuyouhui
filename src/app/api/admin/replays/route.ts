import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const items = await prisma.replayVideo.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json({ ok: true, items });
}

const schema = z.object({
  title: z.string().min(1).max(120),
  league: z.string().min(1).max(30),
  leagueIcon: z.string().max(10).default('⚽'),
  home: z.string().max(50).optional(),
  away: z.string().max(50).optional(),
  score: z.string().max(20).optional(),
  videoId: z.string().min(3).max(20),
});

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.replayVideo.create({
      data: {
        ...parsed.data,
        home: parsed.data.home || null,
        away: parsed.data.away || null,
        score: parsed.data.score || null,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}