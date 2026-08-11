// Integration test for PgvectorRepository.
// Gated on PG_DSN env var; skipped when absent. Uses a real Postgres
// + pgvector instance (local docker or CI service container).

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import pg from "pg";
import { PgvectorRepository } from "@adapters/pgvector-repo";
import { createMemo, MODEL_DIM } from "@domain/memo";
import { createEmbedding } from "@domain/embedding";

const DSN = process.env.PG_DSN;
const HAS = !!DSN;
const d = HAS ? describe : describe.skip;

d("PgvectorRepository integration", () => {
  let repo: PgvectorRepository;

  beforeAll(async () => {
    const pool = new pg.Pool({ connectionString: DSN });
    await pool.query("CREATE EXTENSION IF NOT EXISTS vector");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.memos (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        summary TEXT,
        embedding vector(1536),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await pool.query("TRUNCATE TABLE public.memos");
    repo = new PgvectorRepository(pool);
  }, 30_000);

  afterAll(async () => { await repo?.close(); });

  it("round-trips a memo with an embedding", async () => {
    const m = createMemo({
      id: "test-1",
      title: "T",
      body: "B",
      embedding: createEmbedding(new Array(MODEL_DIM).fill(0.1))
    });
    await repo.save(m);
    const got = await repo.findById("test-1" as never);
    expect(got).not.toBeNull();
    expect(got!.id).toBe("test-1");
  }, 30_000);
});
