import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// For platforms like Vercel Cron, use GET handler to trigger job.
export async function GET(_req: NextRequest) {
  try {
    const now = new Date().toISOString();
    const due = db.getDue(now);

    // TODO: Integrate with Farcaster/Neynar posting logic here.
    // For now, mark as posted and log.
    const posted: string[] = [];
    for (const post of due) {
      try {
        // Placeholder for publish call
        // await publishToFarcaster(post.content)
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
      { error: "Cron run failed", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
