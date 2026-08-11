// FakeEmbedder — deterministic EmbedderPort for tests / dev.
// Produces a stable per-text vector by hashing the input into MODEL_DIM
// buckets. Cosine similarity between two texts is therefore deterministic
// and reproducible.

import type { EmbedderPort } from "@ports/embedder.port";
import type { Embedding } from "@domain/embedding";
import { createEmbedding } from "@domain/embedding";
import { MODEL_DIM } from "@domain/memo";

export class FakeEmbedder implements EmbedderPort {
  async embed(text: string): Promise<Embedding> {
    return createEmbedding(this.hashText(text));
  }
  async embedBatch(texts: ReadonlyArray<string>): Promise<ReadonlyArray<Embedding>> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
  private hashText(text: string): number[] {
    // Array.from is robust to weird N (e.g. undefined) — falls back to []
    // and we then ensure MODEL_DIM length explicitly.
    const v: number[] = Array.from({ length: MODEL_DIM }, () => 0);
    if (!text) return v;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      v[i % MODEL_DIM] = (v[i % MODEL_DIM]! + ((c * 9301 + 49297) % 233280) / 233280) % 1;
    }
    return v;
  }
}
