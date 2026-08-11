// PgvectorRepository — production MemoRepositoryPort + SearchIndexPort
// backed by Postgres + the pgvector extension.
//
// Schema (managed by `scripts/migrate.sql`):
//   CREATE EXTENSION IF NOT EXISTS vector;
//   CREATE TABLE memos (
//     id         TEXT PRIMARY KEY,
//     owner_id   TEXT NOT NULL,
//     title      TEXT NOT NULL,
//     body       TEXT NOT NULL,
//     tags       TEXT[] NOT NULL DEFAULT '{}',
//     summary    TEXT,
//     embedding  vector(1536),
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
//   );
//   CREATE INDEX memos_embedding_idx ON memos USING ivfflat (embedding vector_cosine_ops);

import type { Pool, PoolConfig } from "pg";
import pg from "pg";
import type { Memo, MemoId } from "@domain/memo";
import { createMemo } from "@domain/memo";
import type { MemoRepositoryPort, ListOptions } from "@ports/repository.port";
import type { SearchIndexPort } from "@ports/search.port";
import type { Embedding } from "@domain/embedding";
import { cosineSimilarity, MODEL_DIM } from "@domain/embedding";

type Row = {
  id: string;
  owner_id: string;
  title: string;
  body: string;
  tags: string[];
  summary: string | null;
  embedding: number[] | null;
  created_at: Date;
  updated_at: Date;
};

export interface PgvectorConfig extends PoolConfig {
  /** Optional schema name. Defaults to "public". */
  schema?: string;
}

export class PgvectorRepository implements MemoRepositoryPort, SearchIndexPort {
  private readonly pool: Pool;
  private readonly schema: string;

  constructor(poolOrConfig: Pool | PgvectorConfig) {
    this.pool = "connect" in poolOrConfig ? poolOrConfig : new pg.Pool(poolOrConfig);
    this.schema = "schema" in poolOrConfig && poolOrConfig.schema ? poolOrConfig.schema : "public";
  }

  // ---------- MemoRepositoryPort ----------

  async save(memo: Memo): Promise<Memo> {
    const ownerId = (memo as { ownerId?: string }).ownerId ?? "anonymous";
    const emb = memo.embedding ? `[${memo.embedding.vector.join(",")}]` : null;
    const sql = `
      INSERT INTO ${this.schema}.memos
        (id, owner_id, title, body, tags, summary, embedding, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7::vector, $8,$9)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        tags = EXCLUDED.tags,
        summary = EXCLUDED.summary,
        embedding = EXCLUDED.embedding,
        updated_at = now()
      RETURNING *`;
    await this.pool.query(sql, [
      memo.id,
      ownerId,
      memo.title,
      memo.body,
      memo.tags.map((t) => t.value),
      memo.summary,
      emb,
      memo.createdAt,
      memo.updatedAt
    ]);
    return memo;
  }

  async findById(id: MemoId): Promise<Memo | null> {
    const r = await this.pool.query<Row>(
      `SELECT * FROM ${this.schema}.memos WHERE id = $1`,
      [id]
    );
    return r.rows[0] ? rowToMemo(r.rows[0]) : null;
  }

  async listByOwner(ownerId: string, opts?: ListOptions): Promise<ReadonlyArray<Memo>> {
    const limit = opts?.limit ?? 100;
    const offset = opts?.offset ?? 0;
    const r = await this.pool.query<Row>(
      `SELECT * FROM ${this.schema}.memos WHERE owner_id = $1
       ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
      [ownerId, limit, offset]
    );
    return r.rows.map(rowToMemo);
  }

  async deleteById(id: MemoId): Promise<boolean> {
    const r = await this.pool.query(
      `DELETE FROM ${this.schema}.memos WHERE id = $1`,
      [id]
    );
    return (r.rowCount ?? 0) > 0;
  }

  // ---------- SearchIndexPort ----------

  async query(query: Embedding, k: number): Promise<ReadonlyArray<Memo>> {
    if (!Number.isInteger(k) || k <= 0) return [];
    const sql = `
      SELECT *, 1 - (embedding <=> $1::vector) AS similarity
      FROM ${this.schema}.memos
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2`;
    const qvec = `[${query.vector.join(",")}]`;
    const r = await this.pool.query<Row & { similarity: number }>(sql, [qvec, k]);
    return r.rows.map(rowToMemo);
  }

  async index(memo: Memo): Promise<void> {
    if (!memo.embedding) throw new Error("Cannot index a memo without an embedding");
    await this.save(memo);
  }

  async remove(id: Memo["id"]): Promise<void> {
    await this.deleteById(id);
  }

  /** Close the underlying pool. Call on shutdown. */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

function rowToMemo(row: Row): Memo {
  const base = createMemo({
    id: row.id,
    title: row.title,
    body: row.body,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
  // Restore tags from TEXT[] column.
  const tags = row.tags.map((v) => ({ value: v, source: "user" as const }));
  // Restore embedding from pgvector-returned number[].
  const embedding =
    row.embedding && row.embedding.length === MODEL_DIM
      ? { vector: row.embedding, model: "text-embedding-3-small", dim: MODEL_DIM }
      : null;
  return { ...base, tags, embedding, ...{ ownerId: row.owner_id } as object };
}

// Used by integration tests only; safe to ignore.
export { cosineSimilarity };
