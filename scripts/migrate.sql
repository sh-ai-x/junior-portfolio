-- Migration: pgvector schema for 01-ai-memo.
-- Run once per database using psql with the connection string.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.memos (
  id         TEXT PRIMARY KEY,
  owner_id   TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  tags       TEXT[] NOT NULL DEFAULT '{}',
  summary    TEXT,
  embedding  vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS memos_owner_idx     ON public.memos (owner_id);
CREATE INDEX IF NOT EXISTS memos_updated_idx   ON public.memos (updated_at DESC);
CREATE INDEX IF NOT EXISTS memos_embedding_idx ON public.memos
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
