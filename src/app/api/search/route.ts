import { NextResponse } from "next/server";
import { getContainer } from "@lib/container";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  if (!q) return NextResponse.json({ results: [] });
  const c = getContainer();
  const emb = await c.embedder.embed(q);
  const top = await c.search.query(emb, 10);
  return NextResponse.json({
    results: top.map((m) => ({ id: m.id, title: m.title }))
  });
}
