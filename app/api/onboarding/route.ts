import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const DEFAULT_CREATOR = 'skillswapmn@gmail.com';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { canTeach, wantsHelpWith } = await req.json();

  if (!Array.isArray(canTeach) || !Array.isArray(wantsHelpWith)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  const skillsCol = db.collection('skills');
  const usersCol = db.collection('users');

  // 🔐 Fetch ONLY skills the user is allowed to reference
  const allowedSkills = await skillsCol
    .find({
      active: true,
      $or: [
        { createdBy: DEFAULT_CREATOR },        // global skills
        { createdBy: session.user.email },     // user's own skills
      ],
    })
    .project({ slug: 1 })
    .toArray();

  const allowedSlugs = new Set(allowedSkills.map((s) => s.slug));

  // 🔐 Filter incoming arrays
  const safeCanTeach = canTeach.filter((slug) => allowedSlugs.has(slug));
  const safeWantsHelpWith = wantsHelpWith.filter((slug) =>
    allowedSlugs.has(slug)
  );

  await usersCol.updateOne(
    { email: session.user.email },
    {
      $set: {
        canTeach: safeCanTeach,
        wantsHelpWith: safeWantsHelpWith,
        image: session.user.image,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        email: session.user.email,
        name: session.user.name,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({
    ok: true,
    canTeach: safeCanTeach,
    wantsHelpWith: safeWantsHelpWith,
  });
}