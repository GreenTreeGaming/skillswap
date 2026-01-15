import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, skillSlug, message, timeWindow, format } = await req.json();

  if (!to || !skillSlug) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  if (to === session.user.email) {
    return NextResponse.json({ error: 'Cannot request yourself' }, { status: 400 });
  }

  // optional validation
  const safeFormat =
    format === 'online' || format === 'in-person' ? format : 'online';

  const client = await clientPromise;
  const db = client.db('skillswap');

  const request = {
    from: session.user.email,
    to,
    skillSlug,
    message: typeof message === 'string' ? message.trim() : '',
    timeWindow: typeof timeWindow === 'string' ? timeWindow : '',
    format: safeFormat,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('requests').insertOne(request);

  return NextResponse.json({ ok: true });
}