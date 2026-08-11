// Port: EmbedderPort — converts text to a fixed-dim Embedding.
// Both the real OpenAI adapter and the FakeEmbedder must satisfy this
// contract. The vector length is fixed by MODEL_DIM (1536) — adapters
// MUST pad / truncate so the contract holds.

import type { Embedding } from "@domain/embedding";

export interface EmbedderPort {
  /**
   * Embed a single text. Throws on transport errors. Returns a vector of
   * exactly MODEL_DIM (1536) finite numbers.
   */
  embed(text: string): Promise<Embedding>;

  /**
   * Batch variant. Implementations MAY fall back to N sequential embed()
   * calls, but the batch contract MUST hold (return one Embedding per
   * input in the same order).
   */
  embedBatch(texts: ReadonlyArray<string>): Promise<ReadonlyArray<Embedding>>;
}

export const EMBEDDER_PORT = Symbol.for("01-ai-memo/ports/embedder");
