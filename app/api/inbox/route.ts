import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email?.toLowerCase();

  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clientPromise;
  const db = client.db('skillswap');

  const incoming = await db
    .collection('requests')
    .find({ to: me })
    .sort({ createdAt: -1 })
    .toArray();

  const outgoing = await db
    .collection('requests')
    .find({ from: me })
    .sort({ createdAt: -1 })
    .toArray();

  const all = [...incoming, ...outgoing];

  const sessionIds = Array.from(
    new Set(
      all
        .map((r: any) => r.sessionId)
        .filter(Boolean)
        .map((x: any) => String(x))
    )
  );

  const sessions = sessionIds.length
    ? await db
        .collection('sessions')
        .find({ sessionId: { $in: sessionIds } })
        .toArray()
    : [];

  // if some sessions were saved without sessionId field (only _id), also fetch by _id:
  const sessionsByObjectId = sessionIds.length
    ? await db
        .collection('sessions')
        .find({ _id: { $in: sessionIds.filter((id) => id.length === 24).map((id) => new (require('mongodb').ObjectId)(id)) } })
        .toArray()
        .catch(() => [])
    : [];

  const merged = [...sessions, ...sessionsByObjectId];

  const sessionMap: Record<string, any> = {};
  for (const s of merged) {
    const key = String(s.sessionId ?? s._id);
    sessionMap[key] = s;
  }

  return NextResponse.json({ incoming, outgoing, sessions: sessionMap });
}