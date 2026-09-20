import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

const schema = z.object({
  title: z.string().min(1).max(120).optional(),
  league: z.string().min(1).max(30).optional(),
  leagueIcon: z.string().max(10).optional(),
  home: z.string().max(50).nullable().optional(),
  away: z.string().max(50).nullable().optional(),
  score: z.string().max(20).nullable().optional(),
  videoId: z.string().min(3).max(20).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const item = await prisma.replayVideo.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.replayVideo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}