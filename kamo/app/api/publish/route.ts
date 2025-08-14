import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const now = new Date().toISOString();
    const due = db.getDue(now);
    const posted: string[] = [];
    for (const post of due) {
      try {
        // Placeholder for publish call
        db.update(post.id, { status: "posted" });
        posted.push(post.id);
      } catch (e: any) {
        db.update(post.id, { status: "failed", error: String(e?.message ?? e) });
      }
    }
    return NextResponse.json(
      { runAt: now, processed: due.length, posted },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Publish run failed", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
