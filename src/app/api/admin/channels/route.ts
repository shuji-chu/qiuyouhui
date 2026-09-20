import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

// ============ 列表 ============
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  const channels = await prisma.channel.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ ok: true, channels });
}

// ============ 新增 ============
const schema = z.object({
  name: z.string().min(1).max(100),
  league: z.string().min(1).max(30),
  leagueIcon: z.string().max(10).default('⚽'),
  home: z.string().max(50).optional(),
  away: z.string().max(50).optional(),
  homeScore: z.number().int().optional(),
  awayScore: z.number().int().optional(),
  minute: z.number().int().optional(),
  status: z.enum(['live', 'upcoming', 'replay']),
  streamUrl: z.string().url('必须是合法的 URL'),
  coverUrl: z.string().optional(),
  viewers: z.number().int().default(0),
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

    const channel = await prisma.channel.create({
      data: {
        ...parsed.data,
        home: parsed.data.home || null,
        away: parsed.data.away || null,
        coverUrl: parsed.data.coverUrl || null,
      },
    });

    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}