import { NextRequest, NextResponse } from "next/server";
import { db, type ScheduledPost } from "@/lib/db";

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
        { status: 400 }
      );
    }

    const postId = id ?? crypto.randomUUID();
    const created = db.create({
      id: postId,
      content,
      scheduledAt,
    } as ScheduledPost);

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to schedule post", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
