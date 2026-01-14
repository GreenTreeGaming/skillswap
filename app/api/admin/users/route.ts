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
  const usersCollection = db.collection('users');

  // Check if user is admin
  const currentUser = await usersCollection.findOne({ email: session.user.email });
  
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  // Fetch all users with their skills
  const users = await usersCollection
    .find({})
    .project({
      _id: 1,
      name: 1,
      email: 1,
      image: 1,
      role: 1,
      canTeach: 1,
      wantsHelpWith: 1,
      onboardingCompleted: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .toArray();

  // Get all skills for label mapping
  const skills = await db
    .collection('skills')
    .find({ active: true })
    .project({ slug: 1, label: 1 })
    .toArray();

  const skillMap = new Map(skills.map(s => [s.slug, s.label]));

  // Enrich user data with skill labels
  const enrichedUsers = users.map(user => ({
    ...user,
    canTeachLabels: (user.canTeach || []).map((slug: string) => skillMap.get(slug) || slug),
    wantsHelpWithLabels: (user.wantsHelpWith || []).map((slug: string) => skillMap.get(slug) || slug),
  }));

  return NextResponse.json({ users: enrichedUsers });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');
  const usersCollection = db.collection('users');

  // Check if user is admin
  const currentUser = await usersCollection.findOne({ email: session.user.email });
  
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { email, role } = await req.json();

  if (!email || !role || !['skillswapper', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Update user role
  await usersCollection.updateOne(
    { email },
    { $set: { role, updatedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}
