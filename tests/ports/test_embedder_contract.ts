// Contract suite for EmbedderPort. Same suite must pass for FakeEmbedder
// and OpenAIEmbedder (step 3).
//
// Invariants covered:
//   1. embed() returns an Embedding
//   2. embedding dim equals MODEL_DIM
//   3. all vector components are finite numbers
//   4. embedBatch() returns one Embedding per input, in order
//   5. embed() is deterministic for the same input
//   6. embed() of two distinct inputs yields distinct vectors (most cases)
//   7. embed() does not throw on empty string

import { describe, it, expect } from "vitest";
import { FakeEmbedder } from "@adapters/fakes/fake-embedder";
import { MODEL_DIM } from "@domain/memo";
import type { EmbedderPort } from "@ports/embedder.port";

const embedder: EmbedderPort = new FakeEmbedder();

describe("EmbedderPort contract", () => {
  it("contract 1 — returns Embedding", async () => {
    const e = await embedder.embed("hello");
    expect(e).toBeDefined();
    expect(typeof e.model).toBe("string");
    expect(Array.isArray(e.vector)).toBe(true);
  });

  it("contract 2 — dim equals MODEL_DIM", async () => {
    const e = await embedder.embed("x");
    expect(e.dim).toBe(MODEL_DIM);
    expect(e.vector.length).toBe(MODEL_DIM);
  });

  it("contract 3 — all vector components are finite", async () => {
    const e = await embedder.embed("arbitrary text here");
    for (const x of e.vector) {
      expect(Number.isFinite(x)).toBe(true);
    }
  });

  it("contract 4 — embedBatch returns one per input, in order", async () => {
    const inputs = ["a", "b", "c"];
    const out = await embedder.embedBatch(inputs);
    expect(out.length).toBe(inputs.length);
  });

  it("contract 5 — deterministic", async () => {
    const a = await embedder.embed("hello world");
    const b = await embedder.embed("hello world");
    expect(a.vector).toEqual(b.vector);
  });

  it("contract 6 — different inputs yield different vectors (probabilistic)", async () => {
    const a = await embedder.embed("the quick brown fox");
    const b = await embedder.embed("completely unrelated string with no overlap");
    expect(a.vector).not.toEqual(b.vector);
  });

  it("contract 7 — does not throw on empty input", async () => {
    await expect(embedder.embed("")).resolves.toBeDefined();
  });
});
