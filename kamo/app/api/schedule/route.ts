import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } as const;
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
    const json = await req.json();
    
    // Manual validation since scheduleSchema is missing
    if (!json.text || !json.scheduledAt || !json.fid) {
      return NextResponse.json(
        { error: "Missing required fields: text, scheduledAt, fid" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const created = db.create({
      id: crypto.randomUUID(),
      text: String(json.text),
      scheduledAt: new Date(json.scheduledAt).toISOString(),
      fid: String(json.fid),
      method: json.method === 'onchain' ? 'onchain' : 'offchain',
      imageUrl: json.imageUrl ? String(json.imageUrl) : undefined,
    });

    return NextResponse.json(
      { post: created },
      { status: 201, headers: corsHeaders() }
    );
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
