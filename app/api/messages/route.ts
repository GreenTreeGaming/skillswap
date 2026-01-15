import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

// GET messages between current user and target
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email;
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const to = searchParams.get("to");
  const skill = searchParams.get("skill");

  if (!to || !skill)
    return NextResponse.json({ error: "Missing to or skill" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("skillswap");

  const messages = await db
    .collection("messages")
    .find({
      skillSlug: skill,
      $or: [
        { from: me, to },
        { from: to, to: me },
      ],
    })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json({ messages });
}

// POST a new message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const me = session?.user?.email;
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { to, skill, text } = await req.json();
  if (!to || !skill || !text)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("skillswap");

  const message = {
    from: me,
    to,
    skillSlug: skill,
    text: text.trim(),
    createdAt: new Date(),
  };

  await db.collection("messages").insertOne(message);

  return NextResponse.json({ ok: true });
}