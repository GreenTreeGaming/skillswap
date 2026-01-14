import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('skillswap');

  const skills = await db
    .collection('skills')
    .find({ active: true })
    .project({ slug: 1, label: 1 })
    .toArray();

  return NextResponse.json({ skills });
}