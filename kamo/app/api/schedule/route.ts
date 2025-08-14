import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scheduleSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
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
    );
  }
}
