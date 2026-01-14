import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');
  const users = db.collection('users');

  const user = await users.findOne({ email: session.user.email });

  return NextResponse.json({
    canTeach: user?.canTeach || [],
    wantsHelpWith: user?.wantsHelpWith || [],
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { canTeach, wantsHelpWith } = await req.json();

  if (!Array.isArray(canTeach) || !Array.isArray(wantsHelpWith)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');
  const users = db.collection('users');

  await users.updateOne(
    { email: session.user.email },
    {
      $set: {
        canTeach,
        wantsHelpWith,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true });
}