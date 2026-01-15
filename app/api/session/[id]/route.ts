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
    const action = body?.action;

    const client = await clientPromise;
    const db = client.db('skillswap');

    const sessionId = new ObjectId(id);
    const s = await db.collection('sessions').findOne({ _id: sessionId });

    if (!s) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const from = (s.from ?? '').toLowerCase();
    const to = (s.to ?? '').toLowerCase();

    const isParticipant = me === from || me === to;
    if (!isParticipant) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    // 1) Tutor sets meeting link/address
    if (action === 'setMeetingPlace') {
      // Only tutor can set meeting place
      if (me !== to) {
        return NextResponse.json({ error: 'Only tutor can set meeting details' }, { status: 403 });
      }

      if ((s.status ?? 'active') !== 'active') {
        return NextResponse.json({ error: 'Session already completed' }, { status: 409 });
      }

      const value = String(body?.value ?? '').trim();
      if (!value || value.length > 500) {
        return NextResponse.json({ error: 'Invalid meeting value' }, { status: 400 });
      }

      const kind: 'online' | 'in-person' =
        (s.format ?? '').toLowerCase() === 'in-person' ? 'in-person' : 'online';

      await db.collection('sessions').updateOne(
        { _id: sessionId },
        {
          $set: {
            meetingPlace: {
              kind,
              value,
              updatedBy: me,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          },
        }
      );

      const updated = await db.collection('sessions').findOne({ _id: sessionId });
      return NextResponse.json({ ok: true, session: updated });
    }

    // 2) Finish class (either participant)
    if (action === 'finish') {
      if ((s.status ?? 'active') !== 'active') {
        return NextResponse.json({ ok: true, session: s });
      }

      const setField =
        me === from ? 'finishedBy.from' : 'finishedBy.to';

      await db.collection('sessions').updateOne(
        { _id: sessionId },
        {
          $set: {
            [setField]: true,
            updatedAt: new Date(),
          },
        }
      );

      const after = await db.collection('sessions').findOne({ _id: sessionId });

      const fFrom = !!after?.finishedBy?.from;
      const fTo = !!after?.finishedBy?.to;

      if (fFrom && fTo && (after?.status ?? 'active') === 'active') {
        await db.collection('sessions').updateOne(
          { _id: sessionId },
          {
            $set: {
              status: 'completed',
              completedAt: new Date(),
              updatedAt: new Date(),
            },
          }
        );
      }

      const final = await db.collection('sessions').findOne({ _id: sessionId });
      return NextResponse.json({ ok: true, session: final });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('PATCH /api/session/[id] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}