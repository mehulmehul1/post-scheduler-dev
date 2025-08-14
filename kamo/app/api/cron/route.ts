import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as Record<string, string>;
}

// For platforms like Vercel Cron, use GET handler to trigger job.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sp = url.searchParams;
    const force = sp.get("force") === "1" || sp.get("force") === "true";
    const nowISO = sp.get("now") ?? new Date().toISOString();
    const due = force
      ? db.listAll().filter((p) => p.status === "pending")
      : db.getDue(nowISO);

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
      { runAt: nowISO, processed: due.length, posted },
      { status: 200, headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Cron run failed", details: String(err?.message ?? err) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}
