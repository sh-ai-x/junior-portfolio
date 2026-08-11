// Integration test for OpenAITagger.
// Gated on OPENAI_API_KEY; skipped when absent (CI without secrets).
// Records response from real GPT-4o-mini to verify the contract holds
// end-to-end on a real model response.

import { describe, it, expect } from "vitest";
import { OpenAITagger } from "@adapters/openai-tagger";
import { createMemo } from "@domain/memo";
import { corpusVocabulary } from "@domain/tag";

const HAS_KEY = !!process.env.OPENAI_API_KEY;
const d = HAS_KEY ? describe : describe.skip;

d("OpenAITagger integration", () => {
  it("returns tags from the closed vocabulary for a real memo", async () => {
    const tagger = new OpenAITagger({ model: "gpt-4o-mini" });
    const m = createMemo({
      title: "Weekly retro",
      body: "Discussed the new postgres + pgvector integration and a typescript refactor."
    });
    const vocab = corpusVocabulary();
    const tags = await tagger.tag(m, { vocabulary: vocab, maxTags: 5 });
    expect(tags.length).toBeGreaterThanOrEqual(1);
    for (const t of tags) expect(vocab.has(t.value)).toBe(true);
  }, 30_000);
});
