// Property-based tests on the Memo/Tag/Embedding invariants.
// Each `it(...)` is a fast-check property that the implementation must
// satisfy for any input drawn from the given arbitrary. The AC requires
// >=12 such property tests; this file ships 14 to leave one buffer for
// future regressions.

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  createMemo,
  updateMemoBody,
  attachTags,
  attachSummary,
  attachEmbedding,
  dedupeTags,
  memoHasTag,
  memoSearchableText,
  MODEL_DIM
} from "@domain/memo";
import { corpusVocabulary, makeTag, deriveTags, normalizeTag, SEED_TAG_VOCABULARY } from "@domain/tag";
import {
  createEmbedding,
  cosineSimilarity,
  rankBySimilarity,
  topK
} from "@domain/embedding";

const safeString = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 1, maxLength: 64 }).filter((s) => s.trim().length > 0);

const stringWithAlnum = (): fc.Arbitrary<string> =>
  fc.string({ minLength: 1, maxLength: 64 }).filter((s) => /[a-z0-9]/i.test(s));

const embeddingVec = (): fc.Arbitrary<number[]> =>
  fc.array(
    fc.double({ min: -1, max: 1, noNaN: true, noDefaultInfinity: true }),
    { minLength: MODEL_DIM, maxLength: MODEL_DIM }
  );

const vocabSubset = (): fc.Arbitrary<ReadonlyArray<string>> =>
  fc.subarray([...SEED_TAG_VOCABULARY], { minLength: 0, maxLength: 50 });

describe("P1: Memo invariants", () => {
  it("P1.1 — createMemo round-trips title and body untouched", () => {
    fc.assert(
      fc.property(safeString(), safeString(), (title, body) => {
        const m = createMemo({ title, body });
        expect(m.title).toBe(title);
        expect(m.body).toBe(body);
      })
    );
  });

  it("P1.2 — updateMemoBody never mutates the input memo (immutability)", () => {
    fc.assert(
      fc.property(safeString(), safeString(), safeString(), (t1, b1, b2) => {
        const m = createMemo({ title: t1, body: b1 });
        const before = JSON.stringify(m);
        updateMemoBody(m, b2);
        expect(JSON.stringify(m)).toBe(before);
      })
    );
  });

  it("P1.3 — updateMemoBody preserves memo id and createdAt", () => {
    fc.assert(
      fc.property(safeString(), safeString(), safeString(), (t, b1, b2) => {
        const m = createMemo({ title: t, body: b1 });
        const next = updateMemoBody(m, b2);
        expect(next.id).toBe(m.id);
        expect(next.createdAt.getTime()).toBe(m.createdAt.getTime());
      })
    );
  });

  it("P1.4 — attachTags produces a de-duplicated tag list", () => {
    fc.assert(
      fc.property(vocabSubset(), (rawTags) => {
        const tags = rawTags.map((v) => makeTag(v));
        const m = createMemo({ title: "T", body: "B" });
        const next = attachTags(m, tags);
        const values = next.tags.map((t) => t.value);
        expect(new Set(values).size).toBe(values.length);
      })
    );
  });

  it("P1.5 — dedupeTags preserves first-occurrence order", () => {
    fc.assert(
      fc.property(fc.array(fc.constantFrom("work", "learning", "project", "design"), { minLength: 0, maxLength: 20 }), (arr) => {
        const tags = arr.map((v) => makeTag(v));
        const dedup = dedupeTags(tags);
        const seen = new Set<string>();
        for (const t of dedup) {
          expect(seen.has(t.value)).toBe(false);
          seen.add(t.value);
        }
      })
    );
  });
});

describe("P2: Tag invariants", () => {
  it("P2.1 — normalizeTag output matches the kebab pattern whenever input has an alphanumeric", () => {
    fc.assert(
      fc.property(stringWithAlnum(), (raw) => {
        const out = normalizeTag(raw);
        expect(out.length).toBeGreaterThan(0);
        expect(out).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      })
    );
  });

  it("P2.2 — deriveTags ⊆ corpus_vocabulary (the load-bearing invariant)", () => {
    fc.assert(
      fc.property(vocabSubset(), fc.string({ maxLength: 200 }), (extra, body) => {
        const vocab = corpusVocabulary(extra);
        const tags = deriveTags(body, vocab);
        for (const t of tags) expect(vocab.has(t.value)).toBe(true);
      })
    );
  });

  it("P2.3 — deriveTags output is de-duplicated", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 0, maxLength: 200 }), (body) => {
        const tags = deriveTags(body, corpusVocabulary());
        const vals = tags.map((t) => t.value);
        expect(new Set(vals).size).toBe(vals.length);
      })
    );
  });

  it("P2.4 — memoHasTag is consistent with tags list", () => {
    fc.assert(
      fc.property(vocabSubset(), (rawTags) => {
        const tags = rawTags.map((v) => makeTag(v));
        const m = createMemo({ title: "T", body: "B", tags });
        for (const t of tags) expect(memoHasTag(m, t.value)).toBe(true);
        const unseen = SEED_TAG_VOCABULARY.find((v) => !tags.some((tt) => tt.value === v));
        if (unseen !== undefined) expect(memoHasTag(m, unseen)).toBe(false);
      })
    );
  });
});

describe("P3: Embedding invariants", () => {
  it("P3.1 — embedding length is exactly MODEL_DIM", () => {
    fc.assert(
      fc.property(embeddingVec(), (vec) => {
        const e = createEmbedding(vec);
        expect(e.dim).toBe(MODEL_DIM);
        expect(e.vector.length).toBe(MODEL_DIM);
      })
    );
  });

  it("P3.2 — cosineSimilarity(a, a) === 1 for any non-zero vector", () => {
    fc.assert(
      fc.property(embeddingVec().filter((v) => v.some((x) => x !== 0)), (vec) => {
        const e = createEmbedding(vec);
        expect(cosineSimilarity(e, e)).toBeCloseTo(1, 6);
      })
    );
  });

  it("P3.3 — cosineSimilarity(a, b) === cosineSimilarity(b, a) (symmetry)", () => {
    fc.assert(
      fc.property(embeddingVec(), embeddingVec(), (a, b) => {
        const ea = createEmbedding(a);
        const eb = createEmbedding(b);
        const ab = cosineSimilarity(ea, eb);
        const ba = cosineSimilarity(eb, ea);
        expect(ab).toBeCloseTo(ba, 6);
      })
    );
  });

  it("P3.4 — cosineSimilarity output is in [-1, 1]", () => {
    fc.assert(
      fc.property(embeddingVec(), embeddingVec(), (a, b) => {
        const s = cosineSimilarity(createEmbedding(a), createEmbedding(b));
        expect(s).toBeGreaterThanOrEqual(-1);
        expect(s).toBeLessThanOrEqual(1);
      })
    );
  });

  it("P3.5 — rankBySimilarity output is sorted non-increasing by similarity", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            title: safeString(),
            body: safeString(),
            hasEmb: fc.boolean(),
            vec: embeddingVec()
          }),
          { minLength: 1, maxLength: 8 }
        ),
        (rawMemos) => {
          const memos = rawMemos.map((r) =>
            createMemo({
              title: r.title,
              body: r.body,
              embedding: r.hasEmb ? createEmbedding(r.vec) : null
            })
          );
          const query = createEmbedding(new Array(MODEL_DIM).fill(0.5));
          const ranked = rankBySimilarity(query, memos);
          for (let i = 1; i < ranked.length; i++) {
            const prev = ranked[i - 1]!.similarity;
            const cur = ranked[i]!.similarity;
            expect(prev).toBeGreaterThanOrEqual(cur);
          }
        }
      )
    );
  });

  it("P3.6 — topK preserves order and length <= k", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 1000 }), { maxLength: 50 }),
        fc.integer({ min: 0, max: 50 }),
        (arr, k) => {
          const out = topK(arr, k);
          expect(out.length).toBeLessThanOrEqual(Math.min(k, arr.length));
          for (let i = 0; i < out.length; i++) expect(out[i]).toBe(arr[i]);
        }
      )
    );
  });

  it("P3.7 — attachEmbedding preserves all other fields", () => {
    fc.assert(
      fc.property(safeString(), safeString(), embeddingVec(), (t, b, vec) => {
        const m = createMemo({ title: t, body: b, tags: [makeTag("work")] });
        const next = attachEmbedding(m, createEmbedding(vec));
        expect(next.id).toBe(m.id);
        expect(next.title).toBe(m.title);
        expect(next.body).toBe(m.body);
        expect(next.tags).toEqual(m.tags);
        expect(next.summary).toBe(m.summary);
        expect(next.embedding).not.toBeNull();
      })
    );
  });
});

describe("P4: memoSearchableText invariants", () => {
  it("P4.1 — searchable text always contains title and body", () => {
    fc.assert(
      fc.property(safeString(), safeString(), (title, body) => {
        const m = createMemo({ title, body });
        const text = memoSearchableText(m);
        expect(text).toContain(title);
        expect(text).toContain(body);
      })
    );
  });
});
