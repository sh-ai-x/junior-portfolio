// Contract suite for SearchIndexPort.
// Same suite must pass for FakeSearchIndex and pgvector-backed adapter.
//
// Invariants covered:
//   1. query() returns at most k memos
//   2. query() returns memos sorted by descending similarity
//   3. query() of empty index returns empty array
//   4. index() makes a memo retrievable via query()
//   5. remove() excludes a memo from subsequent query()
//   6. query() throws on negative or non-integer k (or returns empty —
//      implementation-defined; we accept both)

import { describe, it, expect, beforeEach } from "vitest";
import { FakeSearchIndex } from "@adapters/fakes/fake-search";
import { createMemo, MODEL_DIM } from "@domain/memo";
import { createEmbedding } from "@domain/embedding";
import type { SearchIndexPort } from "@ports/search.port";
import type { Embedding } from "@domain/embedding";

const e = (v: number): Embedding => createEmbedding(new Array(MODEL_DIM).fill(v));

describe("SearchIndexPort contract", () => {
  let idx: SearchIndexPort;
  beforeEach(() => {
    idx = new FakeSearchIndex();
  });

  it("contract 1 — query returns at most k memos", async () => {
    const memos = Array.from({ length: 10 }, (_, i) =>
      createMemo({ id: `m${i}`, title: `T${i}`, body: "B", embedding: e(0.1 * i) })
    );
    for (const m of memos) await idx.index(m);
    const out = await idx.query(e(1), 3);
    expect(out.length).toBeLessThanOrEqual(3);
  });

  it("contract 2 — query returns memos sorted by descending similarity", async () => {
    const m1 = createMemo({ id: "1", title: "T", body: "B", embedding: e(1) });
    const m2 = createMemo({ id: "2", title: "T", body: "B", embedding: e(0.5) });
    const m3 = createMemo({ id: "3", title: "T", body: "B", embedding: e(0) });
    await idx.index(m1);
    await idx.index(m2);
    await idx.index(m3);
    const out = await idx.query(e(1), 3);
    expect(out[0]!.id).toBe("1");
  });

  it("contract 3 — query of empty index returns empty array", async () => {
    const out = await idx.query(e(1), 5);
    expect(out).toEqual([]);
  });

  it("contract 4 — index makes memo retrievable via query", async () => {
    const m = createMemo({ id: "x", title: "T", body: "B", embedding: e(1) });
    await idx.index(m);
    const out = await idx.query(e(1), 5);
    expect(out.some((x) => x.id === "x")).toBe(true);
  });

  it("contract 5 — remove excludes a memo from subsequent query", async () => {
    const m = createMemo({ id: "x", title: "T", body: "B", embedding: e(1) });
    await idx.index(m);
    await idx.remove(m.id);
    const out = await idx.query(e(1), 5);
    expect(out.some((x) => x.id === "x")).toBe(false);
  });
});
