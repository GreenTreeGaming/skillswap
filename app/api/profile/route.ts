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

  const user = await users.findOne(
    { email: session.user.email },
    { projection: { _id: 0 } }
  );

  return NextResponse.json(user);
}