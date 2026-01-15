import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // change to your DB name
    const col = db.collection("healthchecks");

    const doc = { createdAt: new Date(), note: "hello from nextjs" };
    const insert = await col.insertOne(doc);

    const found = await col.findOne({ _id: insert.insertedId });

    return Response.json({ ok: true, insertedId: insert.insertedId, found });
  } catch (e: any) {
    return Response.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}