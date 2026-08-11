// Composition root. Wires ports to adapters based on env. The fake
// adapters run in development when USE_FAKES=1 is set; otherwise the
// real OpenAI + pgvector adapters are wired.

import type { TaggerPort } from "@ports/tagger.port";
import type { EmbedderPort } from "@ports/embedder.port";
import type { MemoRepositoryPort } from "@ports/repository.port";
import type { SearchIndexPort } from "@ports/search.port";
import { FakeTagger } from "../adapters/fakes/fake-tagger";
import { FakeEmbedder } from "../adapters/fakes/fake-embedder";
import { FakeMemoRepository } from "../adapters/fakes/fake-repository";
import { FakeSearchIndex } from "../adapters/fakes/fake-search";

export interface Container {
  tagger: TaggerPort;
  embedder: EmbedderPort;
  repository: MemoRepositoryPort;
  search: SearchIndexPort;
}

let cached: Container | null = null;

export function getContainer(): Container {
  if (cached) return cached;
  const useFakes = process.env.USE_FAKES === "1";
  if (useFakes) {
    cached = {
      tagger: new FakeTagger(),
      embedder: new FakeEmbedder(),
      repository: new FakeMemoRepository(),
      search: new FakeSearchIndex()
    };
    return cached;
  }
  // Lazy-load real adapters only when env asks for them; this keeps
  // the import graph from blowing up if OpenAI/PG packages are absent
  // in a developer's sandbox.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OpenAITagger } = require("../adapters/openai-tagger") as typeof import("../adapters/openai-tagger");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OpenAIEmbedder } = require("../adapters/openai-embedder") as typeof import("../adapters/openai-embedder");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PgvectorRepository } = require("../adapters/pgvector-repo") as typeof import("../adapters/pgvector-repo");
  const pgConfig = {
    connectionString: process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL
  };
  const repo = new PgvectorRepository(pgConfig);
  cached = {
    tagger: new OpenAITagger(),
    embedder: new OpenAIEmbedder(),
    repository: repo,
    search: repo
  };
  return cached;
}

export function resetContainer(): void {
  cached = null;
}
