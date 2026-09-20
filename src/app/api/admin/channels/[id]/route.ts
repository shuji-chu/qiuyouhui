import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  league: z.string().min(1).max(30).optional(),
  leagueIcon: z.string().max(10).optional(),
  home: z.string().max(50).nullable().optional(),
  away: z.string().max(50).nullable().optional(),
  homeScore: z.number().int().nullable().optional(),
  awayScore: z.number().int().nullable().optional(),
  minute: z.number().int().nullable().optional(),
  status: z.enum(['live', 'upcoming', 'replay']).optional(),
  streamUrl: z.string().url().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  viewers: z.number().int().optional(),
});

// ============ 更新 ============
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
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const channel = await prisma.channel.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, channel });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// ============ 删除 ============
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '无权限' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.channel.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}