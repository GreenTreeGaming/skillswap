import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('skillswap');

  const skills = await db
    .collection('skills')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    skills: skills.map((s) => ({
      slug: s.slug,
      label: s.label,
      category: s.category,
      createdBy: s.createdBy,
      active: s.active !== false,
      createdAt: s.createdAt,
    })),
  });
}

export async function PATCH(req: Request) {
  const { slug, updates } = await req.json();

  if (!slug || !updates) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  await db.collection('skills').updateOne(
    { slug },
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
  const { slug } = await req.json();

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db('skillswap');

  await db.collection('skills').deleteOne({ slug });

  return NextResponse.json({ ok: true });
}