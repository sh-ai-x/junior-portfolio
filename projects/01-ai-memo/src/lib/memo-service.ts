// Application service: orchestrates tag + embed + persist + index for
// a single Memo creation. Stateless; the caller supplies the
// container so tests can swap adapters.

import type { Memo } from "@domain/memo";
import { createMemo } from "@domain/memo";
import type { Container } from "./container";

export interface CreateMemoRequest {
  title: string;
  body: string;
  ownerId: string;
}

export async function createMemoWithEnrichment(
  req: CreateMemoRequest,
  c: Container
): Promise<Memo> {
  const base = createMemo({ title: req.title, body: req.body });
  // Tag first (cheap), embed second (more expensive).
  const tags = await c.tagger.tag(base);
  const withTags = { ...base, tags };
  const embedding = await c.embedder.embed(`${withTags.title}\n\n${withTags.body}`);
  const enriched = { ...withTags, embedding };
  const saved = await c.repository.save(enriched);
  await c.search.index(saved);
  return saved;
}
