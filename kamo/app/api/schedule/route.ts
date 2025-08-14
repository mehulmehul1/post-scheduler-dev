import { NextRequest, NextResponse } from "next/server";
import { db, type ScheduledPost } from "@/lib/db";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as Record<string, string>;
}

export async function GET() {
  try {
    const posts = db.listAll();
    return NextResponse.json({ posts }, { status: 200, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to list posts", details: String(err?.message ?? err) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, content, scheduledAt } = body as {
      id?: string;
      content?: string;
      scheduledAt?: string;
    };

    if (!content || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields: content, scheduledAt" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const postId = id ?? crypto.randomUUID();
    const created = db.create({
      id: postId,
      content,
      scheduledAt,
    } as ScheduledPost);

    return NextResponse.json({ post: created }, { status: 201, headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to schedule post", details: String(err?.message ?? err) },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}
