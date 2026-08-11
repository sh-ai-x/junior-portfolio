// Contract suite for TaggerPort. The same suite must pass for both
// FakeTagger (this file's default) and OpenAITagger (step 3).
//
// Invariants covered:
//   1. tag() returns a ReadonlyArray<Tag>
//   2. tag() returns at most opts.maxTags entries when provided
//   3. tag() tags are all in the provided vocabulary when supplied
//   4. tag() returns no duplicate tag values
//   5. tag() returns at least one tag for non-empty memo body with vocabulary hits
//   6. tag() is idempotent (same input → same output)
//   7. tag() does not throw on empty body
//   8. tag() respects the closed-world vocabulary when supplied

import { describe, it, expect } from "vitest";
import { FakeTagger } from "@adapters/fakes/fake-tagger";
import { createMemo } from "@domain/memo";
import { corpusVocabulary, makeTag } from "@domain/tag";
import type { TaggerPort } from "@ports/tagger.port";

const tagger: TaggerPort = new FakeTagger();

describe("TaggerPort contract", () => {
  it("contract 1 — returns ReadonlyArray<Tag>", async () => {
    const m = createMemo({ title: "Work memo", body: "typescript learning project" });
    const tags = await tagger.tag(m);
    expect(Array.isArray(tags)).toBe(true);
  });

  it("contract 2 — respects maxTags", async () => {
    const m = createMemo({
      title: "T",
      body: "work learning project design review planning meeting frontend backend typescript react nextjs"
    });
    const tags = await tagger.tag(m, { maxTags: 3 });
    expect(tags.length).toBeLessThanOrEqual(3);
  });

  it("contract 3 — all returned tags in supplied vocabulary", async () => {
    const vocab = new Set(["work", "learning", "project"]);
    const m = createMemo({ title: "T", body: "work learning project typescript react" });
    const tags = await tagger.tag(m, { vocabulary: vocab });
    for (const t of tags) expect(vocab.has(t.value)).toBe(true);
  });

  it("contract 4 — no duplicate tag values", async () => {
    const m = createMemo({
      title: "T",
      body: "work work work learning learning project project design"
    });
    const tags = await tagger.tag(m);
    const vals = tags.map((t) => t.value);
    expect(new Set(vals).size).toBe(vals.length);
  });

  it("contract 5 — non-empty memo with vocabulary hits returns >= 1 tag", async () => {
    const m = createMemo({ title: "T", body: "work" });
    const tags = await tagger.tag(m, { vocabulary: corpusVocabulary() });
    expect(tags.length).toBeGreaterThanOrEqual(1);
  });

  it("contract 6 — idempotent (same input → same output)", async () => {
    const m = createMemo({ title: "Work typescript", body: "learning project design" });
    const a = await tagger.tag(m);
    const b = await tagger.tag(m);
    expect(a.map((t) => t.value)).toEqual(b.map((t) => t.value));
  });

  it("contract 7 — does not throw on empty body", async () => {
    const m = createMemo({ title: "T", body: "" });
    await expect(tagger.tag(m)).resolves.toBeDefined();
  });

  it("contract 8 — closed-world: rejects tokens outside vocabulary", async () => {
    const vocab = new Set(["work"]);
    const m = createMemo({ title: "T", body: "work learning project design" });
    const tags = await tagger.tag(m, { vocabulary: vocab });
    expect(tags.map((t) => t.value)).toEqual(["work"]);
  });
});
