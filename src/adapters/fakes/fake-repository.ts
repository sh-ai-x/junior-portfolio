// FakeMemoRepository — in-memory MemoRepositoryPort for tests / dev.
// Persists memos in a Map. Iteration order is insertion order.

import type { MemoRepositoryPort, ListOptions } from "@ports/repository.port";
import type { Memo, MemoId } from "@domain/memo";

export class FakeMemoRepository implements MemoRepositoryPort {
  private readonly store = new Map<MemoId, Memo>();

  async save(memo: Memo): Promise<Memo> {
    this.store.set(memo.id, memo);
    return memo;
  }
  async findById(id: MemoId): Promise<Memo | null> {
    return this.store.get(id) ?? null;
  }
  async listByOwner(ownerId: string, opts?: ListOptions): Promise<ReadonlyArray<Memo>> {
    // Fake: ignore ownerId since memos don't carry an owner in the
    // domain layer; the real adapter filters by owner_id column.
    const all = [...this.store.values()].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
    const offset = opts?.offset ?? 0;
    const limit = opts?.limit ?? all.length;
    return all.slice(offset, offset + limit);
  }
  async deleteById(id: MemoId): Promise<boolean> {
    return this.store.delete(id);
  }
}
