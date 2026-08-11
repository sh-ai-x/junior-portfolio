// Port: SearchIndexPort — semantic search over Memo embeddings.
// The pgvector adapter uses the <=> cosine distance operator; the
// in-memory fake uses cosineSimilarity. Both must return memos sorted
// by descending similarity.

import type { Memo } from "@domain/memo";
import type { Embedding } from "@domain/embedding";

export interface SearchIndexPort {
  /**
   * Return the top-k memos most similar to `query`. Order is descending
   * by similarity (most similar first). Returns an empty array if the
   * index has no memos. Never returns null entries.
   */
  query(query: Embedding, k: number): Promise<ReadonlyArray<Memo>>;

  /** Insert / upsert a memo's embedding into the index. */
  index(memo: Memo): Promise<void>;

  /** Remove a memo from the index. */
  remove(id: Memo["id"]): Promise<void>;
}

export const SEARCH_INDEX_PORT = Symbol.for("01-ai-memo/ports/search");
