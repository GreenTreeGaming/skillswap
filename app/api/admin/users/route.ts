import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

/**
 * GET  -> list users
 * PATCH -> update user (admin toggle, reset rating)
 * DELETE -> delete user
 */

export async function GET() {
  const client = await clientPromise;
  const db = client.db('skillswap');

  const users = await db
    .collection('users')
    .find({})
    .project({
      _id: 0,
      email: 1,
      name: 1,
      image: 1,
      admin: 1,
      ratingAvg: 1,
      ratingCount: 1,
      canTeach: 1,
      wantsHelpWith: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const { email, updates } = await req.json();

  if (!email || !updates) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  await db.collection('users').updateOne(
    { email },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  await db.collection('users').deleteOne({ email });

  return NextResponse.json({ ok: true });
}