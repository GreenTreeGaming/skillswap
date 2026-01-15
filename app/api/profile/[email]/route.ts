import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: { params: Promise<{ email: string }> }
) {
  const { email: rawEmail } = await context.params;
  const email = decodeURIComponent(rawEmail); // ✅ Decode the email

  console.log('Looking for profile with email:', email); // Debug log

  const client = await clientPromise;
  const db = client.db('skillswap');

  const user = await db.collection('users').findOne({
  email: { $regex: new RegExp(`^${email}$`, 'i') },
});

  console.log('User found:', user ? 'YES' : 'NO'); // Debug log

  if (!user) {
    return NextResponse.json(null, { status: 404 });
  }

  const skills = await db
    .collection('skills')
    .find({ active: true })
    .project({ slug: 1, label: 1 })
    .toArray();

  const skillMap = new Map(
    skills.map((s: any) => [s.slug, s.label])
  );

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: user.image ?? null,

    ratingAvg: user.ratingAvg ?? null,
    ratingCount: user.ratingCount ?? 0,

    canTeach: (user.canTeach ?? []).map((slug: string) => ({
      slug,
      label: skillMap.get(slug) ?? slug,
    })),
    wantsHelpWith: (user.wantsHelpWith ?? []).map((slug: string) => ({
      slug,
      label: skillMap.get(slug) ?? slug,
    })),
  });
}