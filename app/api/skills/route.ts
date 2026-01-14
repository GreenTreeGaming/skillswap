import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const client = await clientPromise;
  const db = client.db('skillswap');

  // Build query: show base skills (no createdBy) + user's custom skills
  const query: any = {
    active: true,
    $or: [
      { createdBy: { $exists: false } }, // Base skills visible to everyone
      { createdBy: session?.user?.email || null }, // User's custom skills
    ],
  };

  const skills = await db
    .collection('skills')
    .find(query)
    .project({ slug: 1, label: 1, category: 1 })
    .toArray();

  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { label } = await req.json();

  if (!label || typeof label !== 'string' || !label.trim()) {
    return NextResponse.json({ error: 'Invalid skill label' }, { status: 400 });
  }

  const slug = label.toLowerCase().trim().replace(/\s+/g, '-');

  const client = await clientPromise;
  const db = client.db('skillswap');
  const skillsCollection = db.collection('skills');

  // Check if skill already exists
  const existing = await skillsCollection.findOne({ slug });
  if (existing) {
    return NextResponse.json({ 
      skill: { slug: existing.slug, label: existing.label, category: existing.category },
      alreadyExists: true 
    });
  }

  // Create new skill with 'study' category (book icon)
  const newSkill = {
    slug,
    label: label.trim(),
    category: 'study',
    active: true,
    createdAt: new Date(),
    createdBy: session.user.email,
  };

  await skillsCollection.insertOne(newSkill);

  return NextResponse.json({ 
    skill: { slug: newSkill.slug, label: newSkill.label, category: newSkill.category },
    created: true
  });
}