// Domain core: Embedding value type + similarity math (cosine).
// Pure numeric code. No IO, no library deps.

import { MODEL_DIM } from "./memo";

export interface Embedding {
  readonly vector: ReadonlyArray<number>;
  readonly model: string;
  readonly dim: number;
}

export const createEmbedding = (
  vector: ReadonlyArray<number>,
  model = "text-embedding-3-small"
): Embedding => {
  if (!Array.isArray(vector)) {
    throw new Error("Embedding.vector must be an array of numbers");
  }
  if (vector.length !== MODEL_DIM) {
    throw new Error(
      `Embedding vector length must be ${MODEL_DIM} (model dim); got ${vector.length}`
    );
  }
  for (const v of vector) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new Error("Embedding values must be finite numbers");
    }
  }
  return { vector, model, dim: vector.length };
};

// Cosine similarity. Returns a value in [-1, 1] for valid inputs.
// Two zero-norm vectors → returns 0 (undefined mathematically; we
// pick a deterministic 0 to keep the contract total).
export const cosineSimilarity = (a: Embedding, b: Embedding): number => {
  if (a.dim !== b.dim) {
    throw new Error(
      `Embedding dims must match for cosine similarity: ${a.dim} vs ${b.dim}`
    );
  }
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.dim; i++) {
    const x = a.vector[i]!;
    const y = b.vector[i]!;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  if (denom === 0) return 0;
  return dot / denom;
};

// Sort memos by similarity to a query embedding, descending. Returns
// a NEW array (input is unchanged). Memos without an embedding sort
// to the end (similarity = -Infinity) so they never appear in top-k.
import type { Memo } from "./memo";

export interface ScoredMemo {
  readonly memo: Memo;
  readonly similarity: number;
}

export const rankBySimilarity = (
  query: Embedding,
  memos: ReadonlyArray<Memo>
): ReadonlyArray<ScoredMemo> => {
  const scored: ScoredMemo[] = [];
  for (const m of memos) {
    if (!m.embedding) {
      scored.push({ memo: m, similarity: Number.NEGATIVE_INFINITY });
      continue;
    }
    scored.push({ memo: m, similarity: cosineSimilarity(query, m.embedding) });
  }
  // Stable sort: higher similarity first; tie-break by id.
  scored.sort((x, y) => {
    if (y.similarity !== x.similarity) return y.similarity - x.similarity;
    return x.memo.id.localeCompare(y.memo.id);
  });
  return scored;
};

export const topK = <T>(arr: ReadonlyArray<T>, k: number): ReadonlyArray<T> => {
  if (!Number.isInteger(k) || k < 0) {
    throw new Error("topK requires a non-negative integer");
  }
  if (k === 0) return [];
  return arr.slice(0, Math.min(k, arr.length));
};
