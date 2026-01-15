import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email?.toLowerCase();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, toUser, rating } = await req.json();

  if (!sessionId || !toUser || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  const sid = new ObjectId(String(sessionId));
  const s = await db.collection('sessions').findOne({ _id: sid });

  if (!s) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const from = String(s.from ?? '').toLowerCase();
  const tutor = String(s.to ?? '').toLowerCase();
  const toUserLower = String(toUser).toLowerCase();

  // requester-only rating, and must be rating the tutor
  if (me !== from) {
    return NextResponse.json({ error: 'Only requester can rate' }, { status: 403 });
  }
  if (toUserLower !== tutor) {
    return NextResponse.json({ error: 'Invalid target user' }, { status: 400 });
  }

  // must be completed and both finished
  if ((s.status ?? 'active') !== 'completed' || !s.finishedBy?.from || !s.finishedBy?.to) {
    return NextResponse.json({ error: 'Session not finished' }, { status: 409 });
  }

  // prevent duplicate rating
  const existing = await db.collection('ratings').findOne({
    sessionId: sid.toString(),
    fromUser: me,
  });
  if (existing) return NextResponse.json({ error: 'Already rated' }, { status: 409 });

  await db.collection('ratings').insertOne({
    sessionId: sid.toString(),
    fromUser: me,
    toUser: tutor,
    rating,
    createdAt: new Date(),
  });

  // robust avg update (handles missing fields)
  await db.collection('users').updateOne(
    { email: tutor },
    [
      {
        $set: {
          ratingCount: { $add: [{ $ifNull: ['$ratingCount', 0] }, 1] },
          ratingAvg: {
            $let: {
              vars: {
                c: { $ifNull: ['$ratingCount', 0] },
                avg: { $ifNull: ['$ratingAvg', 0] },
              },
              in: {
                $divide: [
                  { $add: [{ $multiply: ['$$avg', '$$c'] }, rating] },
                  { $add: ['$$c', 1] },
                ],
              },
            },
          },
        },
      },
    ]
  );

  await db.collection('sessions').updateOne(
    { _id: sid },
    { $set: { rated: true, updatedAt: new Date() } }
  );

  return NextResponse.json({ ok: true });
}