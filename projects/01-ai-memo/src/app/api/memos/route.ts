import { NextResponse } from "next/server";
import { createMemoWithEnrichment } from "@lib/memo-service";
import { getContainer } from "@lib/container";
import type { Memo } from "@domain/memo";

export async function GET() {
  const c = getContainer();
  const memos = await c.repository.listByOwner("demo-owner", { limit: 100 });
  return NextResponse.json({ memos });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { title, body } = (payload ?? {}) as { title?: unknown; body?: unknown };
  if (typeof title !== "string" || typeof body !== "string" || !title || !body) {
    return NextResponse.json({ error: "title and body are required strings" }, { status: 400 });
  }
  const c = getContainer();
  const memo: Memo = await createMemoWithEnrichment(
    { title, body, ownerId: "demo-owner" },
    c
  );
  return NextResponse.json({ memo }, { status: 201 });
}
