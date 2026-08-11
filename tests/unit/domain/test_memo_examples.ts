// Example tests (hand-picked) for the domain core.
// These complement the property tests in test_memo_properties.ts by
// pinning specific behaviors the property tests only check abstractly.

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  createMemo,
  updateMemoBody,
  attachTags,
  attachSummary,
  attachEmbedding,
  memoHasTag,
  memoSearchableText,
  dedupeTags,
  MODEL_DIM
} from "@domain/memo";
import { corpusVocabulary, makeTag, deriveTags } from "@domain/tag";
import {
  createEmbedding,
  cosineSimilarity,
  rankBySimilarity,
  topK
} from "@domain/embedding";

const vec = (fill: number): number[] => new Array(MODEL_DIM).fill(fill);

describe("createMemo", () => {
  it("creates a memo with sane defaults", () => {
    const m = createMemo({ title: "T", body: "B" });
    expect(m.title).toBe("T");
    expect(m.body).toBe("B");
    expect(m.tags).toEqual([]);
    expect(m.summary).toBeNull();
    expect(m.embedding).toBeNull();
    expect(m.createdAt).toBeInstanceOf(Date);
    expect(m.updatedAt).toBeInstanceOf(Date);
  });

  it("throws on empty title", () => {
    expect(() => createMemo({ title: "", body: "B" })).toThrow();
  });

  it("throws if body is not a string", () => {
    // @ts-expect-error testing runtime guard
    expect(() => createMemo({ title: "T", body: 42 })).toThrow();
  });

  it("preserves a caller-supplied id", () => {
    const m = createMemo({ id: "abc-123", title: "T", body: "B" });
    expect(m.id).toBe("abc-123");
  });
});

describe("updateMemoBody", () => {
  it("bumps updatedAt and keeps id stable", () => {
    const m = createMemo({ title: "T", body: "B" });
    const next = updateMemoBody(m, "B2", "T2");
    expect(next.body).toBe("B2");
    expect(next.title).toBe("T2");
    expect(next.id).toBe(m.id);
    expect(next.updatedAt.getTime()).toBeGreaterThanOrEqual(m.updatedAt.getTime());
  });
});

describe("attachTags / dedupeTags", () => {
  it("removes duplicate tags while preserving first occurrence order", () => {
    const t1 = makeTag("work");
    const t2 = makeTag("learning");
    const dedup = dedupeTags([t1, t2, t1, { value: "work", source: "llm" }]);
    expect(dedup.map((t) => t.value)).toEqual(["work", "learning"]);
  });
});

describe("attachSummary / attachEmbedding", () => {
  it("attaches a non-null summary", () => {
    const m = createMemo({ title: "T", body: "B" });
    const next = attachSummary(m, "one-line summary");
    expect(next.summary).toBe("one-line summary");
  });

  it("attaches an embedding and preserves it across updates", () => {
    const m = createMemo({ title: "T", body: "B" });
    const emb = createEmbedding(vec(0.01));
    const next = attachEmbedding(m, emb);
    expect(next.embedding).toBe(emb);
    const after = updateMemoBody(next, "B2");
    expect(after.embedding).toBe(emb);
  });
});

describe("memoHasTag / memoSearchableText", () => {
  it("returns true if any tag matches", () => {
    const m = createMemo({ title: "T", body: "B", tags: [makeTag("work")] });
    expect(memoHasTag(m, "work")).toBe(true);
    expect(memoHasTag(m, "play")).toBe(false);
  });

  it("searchable text includes summary when present", () => {
    const m = createMemo({ title: "T", body: "B", summary: "S" });
    const text = memoSearchableText(m);
    expect(text).toContain("T");
    expect(text).toContain("B");
    expect(text).toContain("S");
  });
});

describe("makeTag / normalizeTag", () => {
  it("lowercases and trims", () => {
    expect(makeTag("  Work  ").value).toBe("work");
  });

  it("rejects empty / oversized / invalid shapes", () => {
    expect(() => makeTag("")).toThrow();
    expect(() => makeTag("a".repeat(40))).toThrow();
    expect(() => makeTag("!!!")).toThrow();
  });
});

describe("deriveTags", () => {
  it("returns tokens that are all in the vocabulary", () => {
    const vocab = corpusVocabulary();
    const tags = deriveTags("I went to work today and learned about typescript", vocab);
    expect(tags.length).toBeGreaterThan(0);
    for (const t of tags) expect(vocab.has(t.value)).toBe(true);
  });

  it("returns no tags when body is empty", () => {
    expect(deriveTags("", corpusVocabulary())).toEqual([]);
  });
});

describe("cosineSimilarity", () => {
  it("returns 1 for identical non-zero vectors", () => {
    const v = vec(0).map((_, i) => (i % 2 === 0 ? 1 : 0));
    const a = createEmbedding(v);
    const b = createEmbedding(v);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 5);
  });

  it("returns 0 for orthogonal vectors", () => {
    const a = createEmbedding(vec(0).map((_, i) => (i < MODEL_DIM / 2 ? 1 : 0)));
    const b = createEmbedding(vec(0).map((_, i) => (i >= MODEL_DIM / 2 ? 1 : 0)));
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it("returns 0 for two zero vectors (deterministic)", () => {
    const z = createEmbedding(vec(0));
    expect(cosineSimilarity(z, z)).toBe(0);
  });

  it("throws on dim mismatch (cosine itself)", () => {
    // Build two Embeddings of the same dim via factory — then mutate
    // the second's `dim` field to simulate the dim mismatch in
    // cosineSimilarity, since createEmbedding guards the dim up front.
    const a = createEmbedding(vec(0.1));
    const b = createEmbedding(vec(0.1));
    const mismatched = { ...b, dim: b.dim + 1 } as typeof b;
    expect(() => cosineSimilarity(a, mismatched)).toThrow();
  });

  it("createEmbedding rejects vectors of wrong length", () => {
    expect(() => createEmbedding([0.1, 0.2, 0.3])).toThrow();
  });
});

describe("rankBySimilarity / topK", () => {
  it("sorts memos by descending similarity", () => {
    const m1 = createMemo({ title: "A", body: "a", embedding: createEmbedding(vec(1)) });
    const m2 = createMemo({ title: "B", body: "b", embedding: createEmbedding(vec(0.5)) });
    const m3 = createMemo({
      title: "C",
      body: "c",
      embedding: createEmbedding(vec(0).map((_, i) => -1 + i / MODEL_DIM))
    });
    const query = createEmbedding(vec(1));
    const ranked = rankBySimilarity(query, [m3, m1, m2]);
    expect(ranked[0]!.memo.id).toBe(m1.id);
  });

  it("memos without an embedding sort to the end", () => {
    const m1 = createMemo({ title: "A", body: "a" });
    const m2 = createMemo({ title: "B", body: "b", embedding: createEmbedding(vec(1)) });
    const ranked = rankBySimilarity(createEmbedding(vec(1)), [m1, m2]);
    expect(ranked[0]!.memo.id).toBe(m2.id);
    expect(ranked[1]!.memo.id).toBe(m1.id);
  });

  it("topK returns up to k items and handles k=0", () => {
    expect(topK([1, 2, 3], 0)).toEqual([]);
    expect(topK([1, 2, 3], 2)).toEqual([1, 2]);
    expect(topK([1, 2], 5).length).toBe(2);
  });

  it("topK rejects negative or non-integer k", () => {
    expect(() => topK([1, 2], -1)).toThrow();
    expect(() => topK([1, 2], 1.5)).toThrow();
  });

  it("rankBySimilarity is a pure function (input array unchanged)", () => {
    const arr = [
      createMemo({ title: "A", body: "a" }),
      createMemo({ title: "B", body: "b" })
    ];
    const before = arr.map((m) => m.id);
    rankBySimilarity(createEmbedding(vec(1)), arr);
    const after = arr.map((m) => m.id);
    expect(after).toEqual(before);
  });
});

describe("fast-check sanity", () => {
  it("runs an arbitrary property", () => {
    fc.assert(fc.property(fc.integer(), (n) => Number.isFinite(n)));
  });
});
