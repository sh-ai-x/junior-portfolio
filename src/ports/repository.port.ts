// Port: MemoRepositoryPort — persistence boundary for Memo.
// The pgvector adapter is the production implementation. Tests use a
// in-memory fake that must pass the same contract suite.

import type { Memo, MemoId } from "@domain/memo";

export interface MemoRepositoryPort {
  /** Insert or update a memo. Returns the persisted Memo. */
  save(memo: Memo): Promise<Memo>;

  /** Lookup by id. Returns null if not found. */
  findById(id: MemoId): Promise<Memo | null>;

  /** List all memos owned by `ownerId`, newest first. */
  listByOwner(ownerId: string, opts?: ListOptions): Promise<ReadonlyArray<Memo>>;

  /** Delete a memo by id. Returns true if a row was removed. */
  deleteById(id: MemoId): Promise<boolean>;
}

export interface ListOptions {
  readonly limit?: number;
  readonly offset?: number;
}

export const MEMO_REPOSITORY_PORT = Symbol.for("01-ai-memo/ports/repository");
