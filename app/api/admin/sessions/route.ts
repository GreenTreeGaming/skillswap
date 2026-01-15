import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('skillswap');

  const sessionsCol = db.collection('sessions');
  const skillsCol = db.collection('skills');

  const sessions = await sessionsCol
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const hydrated = await Promise.all(
    sessions.map(async (s) => {
      const skill = await skillsCol.findOne(
        { slug: s.skillSlug },
        { projection: { label: 1 } }
      );

      return {
        _id: s._id.toString(),
        requesterEmail: s.from,
        tutorEmail: s.to,
        skillSlug: s.skillSlug,
        skillLabel: skill?.label ?? s.skillSlug,
        status: s.status,
        createdAt: s.createdAt,
      };
    })
  );

  return NextResponse.json({ sessions: hydrated });
}