import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = await clientPromise;
    const db = client.db('skillswap');

    const users = await db.collection('users').find().toArray();
    const skills = await db.collection('skills').find({ active: true }).toArray();
    const sessions = await db.collection('sessions').find().toArray();

    // ---- BUILD SKILLS TAB ----
    const skillResults = skills.map((skill) => {
        const helpers = users.filter((u) =>
            u.canTeach?.includes(skill.slug)
        );

        const openSessions = sessions.filter(
            (s) => s.skill === skill.slug && s.status === 'open'
        );

        return {
            slug: skill.slug,
            label: skill.label,
            category: skill.category,
            helpers: helpers.map((u) => ({
                name: u.name,
                email: u.email,
                image: u.image,
                canTeach: u.canTeach,
                wantsHelpWith: u.wantsHelpWith ?? [],
                ratingAvg: u.ratingAvg ?? null,
                ratingCount: u.ratingCount ?? 0,
            })),
            openSessions,
        };
    });


    return NextResponse.json({
        skills: skillResults,
        users,
        sessions,
    });
}