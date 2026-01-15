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
  const skills = db.collection('skills');

  const me = session.user.email.toLowerCase();

  const user = await users.findOne(
    { email: { $regex: new RegExp(`^${me}$`, 'i') } },
    {
      projection: {
        _id: 0,
        name: 1,
        email: 1,
        image: 1,
        canTeach: 1,
        wantsHelpWith: 1,
        ratingAvg: 1,
        ratingCount: 1,
        onboardingCompleted: 1,
        admin: 1, // ✅ ADD THIS
      },
    }
  );

  if (!user) {
    return NextResponse.json(null);
  }

  // Convert skill slugs → labels
  const canTeachLabels = await Promise.all(
    (user.canTeach || []).map(async (slug: string) => {
      const skill = await skills.findOne(
        { slug },
        { projection: { label: 1 } }
      );
      return skill?.label || slug;
    })
  );

  const wantsHelpWithLabels = await Promise.all(
    (user.wantsHelpWith || []).map(async (slug: string) => {
      const skill = await skills.findOne(
        { slug },
        { projection: { label: 1 } }
      );
      return skill?.label || slug;
    })
  );

  return NextResponse.json({
    ...user,
    admin: user.admin === true, // ✅ normalize to boolean
    ratingAvg: user.ratingAvg ?? null,
    ratingCount: user.ratingCount ?? 0,
    canTeach: canTeachLabels,
    wantsHelpWith: wantsHelpWithLabels,
  });
}