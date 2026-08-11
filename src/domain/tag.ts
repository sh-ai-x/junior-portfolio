// Domain core: Tag value type + vocabulary + derivation logic.
// Tags are normalized lowercase identifiers drawn from a finite vocabulary
// (the corpus vocabulary). Derived tags from a memo body must be a subset
// of the vocabulary; unknown tokens are dropped.

export interface Tag {
  readonly value: string;
  readonly source: "user" | "llm" | "derived";
}

export const TAG_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}$/;

export const normalizeTag = (raw: string): string =>
  raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const makeTag = (raw: string, source: Tag["source"] = "derived"): Tag => {
  const value = normalizeTag(raw);
  if (!TAG_PATTERN.test(value)) {
    throw new Error(`Invalid tag value: "${raw}" (normalized: "${value}")`);
  }
  return { value, source };
};

// Stopword set for derived tags: drops common English + Korean boilerplate
// tokens that an LLM might echo in tag output. Keeps the vocabulary honest.
const STOPWORDS = new Set<string>([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were",
  "to", "of", "in", "on", "for", "with", "by", "from", "as", "at",
  "this", "that", "it", "be", "has", "have", "had", "not", "no",
  "i", "you", "we", "they", "he", "she", "my", "our", "their",
  "memo", "note", "tag", "tags", "untagged", "default",
  "그리고", "하지만", "또한", "그래서", "때문에"
]);

export const DERIVED_TOKEN_PATTERN = /[a-z0-9][a-z0-9-]{1,31}/g;

export const deriveTags = (
  body: string,
  vocabulary: ReadonlySet<string>
): ReadonlyArray<Tag> => {
  if (typeof body !== "string") return [];
  const tokens = body.toLowerCase().match(DERIVED_TOKEN_PATTERN) ?? [];
  const out: Tag[] = [];
  const seen = new Set<string>();
  for (const tok of tokens) {
    if (STOPWORDS.has(tok)) continue;
    if (!vocabulary.has(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    out.push({ value: tok, source: "derived" });
  }
  return out;
};

export const mergeTagVocabularies = (
  ...sets: ReadonlyArray<ReadonlySet<string>>
): ReadonlySet<string> => {
  const out = new Set<string>();
  for (const s of sets) for (const v of s) out.add(v);
  return out;
};

// Vocabulary builder: a fixed seed vocabulary that the tagger adapter
// can extend at runtime by returning newly-seen tokens. Memo derivation
// uses this as the closed-world set so `derived_tags ⊆ corpus_vocabulary`
// is a checkable invariant.
export const SEED_TAG_VOCABULARY: ReadonlyArray<string> = [
  "work", "career", "learning", "reading", "writing",
  "project", "planning", "design", "review", "idea",
  "meeting", "1on1", "standup", "retro", "okr",
  "frontend", "backend", "devops", "data", "ml",
  "typescript", "python", "rust", "go", "sql",
  "nextjs", "react", "postgres", "pgvector", "redis",
  "openai", "embedding", "rag", "prompt", "agent",
  "korean", "english", "translation", "interview",
  "health", "exercise", "sleep", "meditation", "food",
  "family", "friends", "relationship", "travel",
  "money", "investing", "budget", "tax", "rent",
  "music", "movie", "book", "game", "photography"
];

export const corpusVocabulary = (
  extra?: ReadonlyArray<string>
): ReadonlySet<string> =>
  mergeTagVocabularies(new Set(SEED_TAG_VOCABULARY), new Set(extra ?? []));
