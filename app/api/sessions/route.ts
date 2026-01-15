import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('skillswap');

  /**
   * Expected collections:
   * - sessions
   * - users
   * - skills
   */

  // Pull all sessions
  const sessions = await db
    .collection('sessions')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  if (sessions.length === 0) {
    return NextResponse.json({ sessions: [] });
  }

  // Collect host emails
  const hostEmails = sessions
    .map((s: any) => s.hostEmail)
    .filter(Boolean);

  // Fetch hosts
  const hosts = await db
    .collection('users')
    .find({ email: { $in: hostEmails } })
    .project({
      email: 1,
      name: 1,
      image: 1,
      ratingAvg: 1,
      ratingCount: 1,
    })
    .toArray();

  const hostMap = new Map(
    hosts.map((u: any) => [u.email, u])
  );

  // Shape response for frontend
  const shaped = sessions.map((s: any) => {
    const host = hostMap.get(s.hostEmail);

    return {
      id: String(s._id),
      title: s.title,
      category: s.category,
      when: s.when ?? 'TBD',
      duration: s.duration ?? '30 min',
      format: s.format ?? 'online',
      spotsLeft: typeof s.spotsLeft === 'number' ? s.spotsLeft : 1,

      hostName: host?.name ?? 'Student',
      hostEmail: s.hostEmail,
      hostImage: host?.image ?? null,

      // optional for later
      createdAt: s.createdAt ?? null,
    };
  });

  return NextResponse.json({ sessions: shaped });
}