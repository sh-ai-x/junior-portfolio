// Domain core: Memo value type + factory + pure derivation functions.
// No IO, no HTTP, no LLM. All operations are pure and total.

import type { Tag } from "./tag";
import type { Embedding } from "./embedding";

export type MemoId = string & { readonly __brand: "MemoId" };

export interface Memo {
  readonly id: MemoId;
  readonly title: string;
  readonly body: string;
  readonly tags: ReadonlyArray<Tag>;
  readonly summary: string | null;
  readonly embedding: Embedding | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const MODEL_DIM = 1536;

export const createMemoId = (raw: string): MemoId => {
  if (typeof raw !== "string" || raw.length === 0) {
    throw new Error("MemoId must be a non-empty string");
  }
  return raw as MemoId;
};

export interface CreateMemoInput {
  id?: string;
  title: string;
  body: string;
  tags?: ReadonlyArray<Tag>;
  summary?: string | null;
  embedding?: Embedding | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createMemo = (input: CreateMemoInput): Memo => {
  if (typeof input.title !== "string" || input.title.length === 0) {
    throw new Error("Memo.title must be a non-empty string");
  }
  if (typeof input.body !== "string") {
    throw new Error("Memo.body must be a string");
  }
  const now = new Date();
  const tags = input.tags ?? [];
  return {
    id: createMemoId(input.id ?? cryptoRandomId()),
    title: input.title,
    body: input.body,
    tags,
    summary: input.summary ?? null,
    embedding: input.embedding ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now
  };
};

export const updateMemoBody = (memo: Memo, newBody: string, newTitle?: string): Memo => {
  if (typeof newBody !== "string") {
    throw new Error("Memo.body must be a string");
  }
  return {
    ...memo,
    body: newBody,
    title: newTitle ?? memo.title,
    updatedAt: new Date()
  };
};

export const attachTags = (memo: Memo, tags: ReadonlyArray<Tag>): Memo => ({
  ...memo,
  tags: dedupeTags(tags),
  updatedAt: new Date()
});

export const attachSummary = (memo: Memo, summary: string): Memo => {
  if (typeof summary !== "string") {
    throw new Error("Memo.summary must be a string");
  }
  return {
    ...memo,
    summary,
    updatedAt: new Date()
  };
};

export const attachEmbedding = (memo: Memo, embedding: Embedding): Memo => ({
  ...memo,
  embedding,
  updatedAt: new Date()
});

export const dedupeTags = (tags: ReadonlyArray<Tag>): ReadonlyArray<Tag> => {
  const seen = new Set<string>();
  const out: Tag[] = [];
  for (const t of tags) {
    if (!seen.has(t.value)) {
      seen.add(t.value);
      out.push(t);
    }
  }
  return out;
};

export const memoHasTag = (memo: Memo, tagValue: string): boolean =>
  memo.tags.some((t) => t.value === tagValue);

export const memoSearchableText = (memo: Memo): string => {
  const parts: string[] = [memo.title, memo.body];
  if (memo.summary) parts.push(memo.summary);
  return parts.join("\n\n");
};

function cryptoRandomId(): string {
  // Lightweight ID without importing crypto at module load time so
  // domain code stays dependency-free. Sufficient uniqueness for the
  // demo; production adapters may replace with ULID.
  const r = Math.random().toString(36).slice(2, 10);
  const t = Date.now().toString(36);
  return `${t}-${r}`;
}
