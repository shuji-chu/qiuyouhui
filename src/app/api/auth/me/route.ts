import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ ok: false, user: null, isAdmin: false });
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
      return NextResponse.json({ ok: false, user: null, isAdmin: false });
    }

    const admin = await isAdmin();

    return NextResponse.json({ ok: true, isAdmin: admin, user });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json(
      { ok: false, user: null, isAdmin: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}