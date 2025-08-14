import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scheduleSchema } from "@/lib/validation";

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
<<<<<<< HEAD
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
=======
    const json = await req.json();
    const data = scheduleSchema.parse(json);
    const created = db.create({
      id: crypto.randomUUID(),
      ...data,
      scheduledAt: new Date(data.scheduledAt).toISOString(),
    });
    return NextResponse.json({ post: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const posts = db.list();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch schedules", details: String(err?.message ?? err) },
      { status: 500 }
>>>>>>> a878bb2295d464df0772f801f41946ce857796b9
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders() });
}
