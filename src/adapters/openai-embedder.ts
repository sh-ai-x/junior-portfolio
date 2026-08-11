// OpenAIEmbedder — production EmbedderPort backed by text-embedding-3-small.
// Pads short embeddings with zeros and truncates longer ones so the
// MODEL_DIM contract (1536) holds for any model output.

import OpenAI from "openai";
import type { EmbedderPort } from "@ports/embedder.port";
import type { Embedding } from "@domain/embedding";
import { createEmbedding, MODEL_DIM } from "@domain/embedding";

export class OpenAIEmbedder implements EmbedderPort {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(opts?: { apiKey?: string; model?: string }) {
    const apiKey = opts?.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for OpenAIEmbedder");
    this.client = new OpenAI({ apiKey });
    this.model = opts?.model ?? "text-embedding-3-small";
  }

  async embed(text: string): Promise<Embedding> {
    const resp = await this.client.embeddings.create({
      model: this.model,
      input: text
    });
    return this.toEmbedding(resp.data[0]?.embedding ?? []);
  }

  async embedBatch(texts: ReadonlyArray<string>): Promise<ReadonlyArray<Embedding>> {
    if (texts.length === 0) return [];
    const resp = await this.client.embeddings.create({
      model: this.model,
      input: [...texts]
    });
    return resp.data.map((d: { embedding: number[] }) => this.toEmbedding(d.embedding));
  }

  private toEmbedding(raw: ReadonlyArray<number>): Embedding {
    const v: number[] = new Array(MODEL_DIM).fill(0);
    const n = Math.min(raw.length, MODEL_DIM);
    for (let i = 0; i < n; i++) v[i] = raw[i]!;
    return createEmbedding(v, this.model);
  }
}
