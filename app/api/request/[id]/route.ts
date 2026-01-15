import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const session = await getServerSession(authOptions);
    const me = session?.user?.email?.toLowerCase();
    if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const status = body?.status;

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('skillswap');

    const _id = new ObjectId(id);

    const request = await db.collection('requests').findOne({ _id });
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // only the receiver (tutor) can accept/reject
    if ((request.to ?? '').toLowerCase() !== me) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // if rejected, just update request
    if (status === 'rejected') {
      await db.collection('requests').updateOne(
        { _id },
        { $set: { status: 'rejected', updatedAt: new Date() } }
      );
      return NextResponse.json({ ok: true });
    }

    // accepted:
    // Create (or reuse) a session. We store sessionId on the request.
    let sessionId: ObjectId | null = null;

    if (request.sessionId) {
      try {
        sessionId = new ObjectId(request.sessionId);
      } catch {
        sessionId = null;
      }
    }

    let sessionDoc = sessionId
      ? await db.collection('sessions').findOne({ _id: sessionId })
      : null;

    if (!sessionDoc) {
      const created = await db.collection('sessions').insertOne({
        requestId: _id,
        from: (request.from ?? '').toLowerCase(),
        to: (request.to ?? '').toLowerCase(),
        skillSlug: request.skillSlug ?? '',
        format: request.format ?? null, // 'online' | 'in-person' | null
        timeWindow: request.timeWindow ?? null,
        status: 'active', // 'active' | 'completed'
        meetingPlace: null as null | {
          kind: 'online' | 'in-person';
          value: string;
          updatedBy: string;
          updatedAt: Date;
        },
        finishedBy: { from: false, to: false },
        completedAt: null as Date | null,
        rated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      sessionId = created.insertedId;

      // backfill reference
      await db.collection('sessions').updateOne(
        { _id: sessionId },
        { $set: { sessionId } } // optional convenience
      );
    }

    await db.collection('requests').updateOne(
      { _id },
      {
        $set: {
          status: 'accepted',
          sessionId: sessionId!.toString(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ ok: true, sessionId: sessionId!.toString() });
  } catch (err) {
    console.error('PATCH /api/request/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}