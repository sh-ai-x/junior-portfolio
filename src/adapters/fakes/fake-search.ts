// FakeSearchIndex — in-memory SearchIndexPort using cosine similarity.
// Indexes memos by their embedding; query returns top-k sorted by
// similarity.

import type { SearchIndexPort } from "@ports/search.port";
import type { Memo } from "@domain/memo";
import type { Embedding } from "@domain/embedding";
import { cosineSimilarity, rankBySimilarity, topK } from "@domain/embedding";

export class FakeSearchIndex implements SearchIndexPort {
  private readonly indexed = new Map<Memo["id"], Memo>();

  async query(query: Embedding, k: number): Promise<ReadonlyArray<Memo>> {
    const memos = [...this.indexed.values()];
    const ranked = rankBySimilarity(query, memos);
    return topK(ranked.map((s) => s.memo), k);
  }
  async index(memo: Memo): Promise<void> {
    if (!memo.embedding) {
      throw new Error("Cannot index a memo without an embedding");
    }
    this.indexed.set(memo.id, memo);
  }
  async remove(id: Memo["id"]): Promise<void> {
    this.indexed.delete(id);
  }
  // Helper for tests
  size(): number { return this.indexed.size; }
  cosineSimilarity: typeof cosineSimilarity = cosineSimilarity;
}
