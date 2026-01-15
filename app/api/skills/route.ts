import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const DEFAULT_CREATOR = 'skillswapmn@gmail.com';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ skills: [] }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  // Get all active skills: default skills OR user's custom skills
  const skills = await db
    .collection('skills')
    .find({
      active: true,
      $or: [
        { createdBy: DEFAULT_CREATOR }, // All default skills
        { createdBy: session.user.email }, // Only current user's custom skills
      ],
    })
    .project({ slug: 1, label: 1, category: 1 })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json({ skills });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { label } = await req.json();

  if (!label || typeof label !== 'string') {
    return NextResponse.json({ error: 'Invalid skill name' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  // Create slug from label
  const slug = label.toLowerCase().replace(/\s+/g, '-');

  // Check if skill already exists
  const existing = await db.collection('skills').findOne({ slug });
  if (existing) {
    return NextResponse.json(existing);
  }

  // Create new skill
  const result = await db.collection('skills').insertOne({
    slug,
    label,
    active: true,
    category: 'custom',
    createdBy: session.user.email,
    createdAt: new Date(),
  });

  return NextResponse.json({
    _id: result.insertedId,
    slug,
    label,
  });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  // Only allow deleting skills that the user created
  const result = await db.collection('skills').deleteOne({
    slug,
    createdBy: session.user.email,
    category: 'custom',
  });

  if (result.deletedCount === 0) {
    // Try to find the skill to give a more helpful error
    const skill = await db.collection('skills').findOne({ slug });
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    if (skill.createdBy !== session.user.email) {
      return NextResponse.json({ error: 'You can only delete your own custom skills' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}