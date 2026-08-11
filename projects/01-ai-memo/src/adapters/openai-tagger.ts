// OpenAITagger — production TaggerPort backed by GPT-4o-mini.
// Asks the model for up to `maxTags` tags from the supplied vocabulary.
// Falls back to the caller's vocabulary (closed-world) when provided.
//
// Usage:
//   const tagger = new OpenAITagger({ apiKey: process.env.OPENAI_API_KEY! });
//   const tags = await tagger.tag(memo, { maxTags: 5, vocabulary });

import OpenAI from "openai";
import type { TaggerPort, TaggerOptions } from "@ports/tagger.port";
import type { Memo } from "@domain/memo";
import type { Tag } from "@domain/tag";
import { makeTag } from "@domain/tag";

export class OpenAITagger implements TaggerPort {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(opts?: { apiKey?: string; model?: string }) {
    const apiKey = opts?.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for OpenAITagger");
    this.client = new OpenAI({ apiKey });
    this.model = opts?.model ?? "gpt-4o-mini";
  }

  async tag(memo: Memo, opts?: TaggerOptions): Promise<ReadonlyArray<Tag>> {
    const max = opts?.maxTags ?? 5;
    const vocab = opts?.vocabulary ? [...opts.vocabulary] : null;
    const system = this.systemPrompt(max, vocab);
    const user = `Title: ${memo.title}\n\nBody: ${memo.body}\n\n${
      memo.summary ? `Summary: ${memo.summary}\n\n` : ""
    }Return JSON.`;
    const resp = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    });
    const raw = resp.choices[0]?.message?.content ?? "{}";
    let parsed: { tags?: unknown };
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const arr = Array.isArray(parsed.tags) ? parsed.tags : [];
    const out: Tag[] = [];
    const seen = new Set<string>();
    for (const t of arr) {
      if (typeof t !== "string") continue;
      try {
        const tag = makeTag(t, "llm");
        if (seen.has(tag.value)) continue;
        if (vocab && !vocab.includes(tag.value)) continue;
        seen.add(tag.value);
        out.push(tag);
      } catch { /* invalid shape — skip */ }
    }
    return out;
  }

  private systemPrompt(max: number, vocab: ReadonlyArray<string> | null): string {
    const vocabLine = vocab
      ? `\nClosed vocabulary (return ONLY tags from this list):\n${vocab.join(", ")}`
      : "";
    return `You are a memo tagger. Output JSON of shape {"tags": string[]}. ${vocabLine}
Return up to ${max} tags, lowercase, kebab-case, ordered most-relevant first.
Do not duplicate. If no good tag fits, return {"tags": []}.`;
  }
}
