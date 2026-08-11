// FakeTagger — deterministic in-memory TaggerPort for tests / dev.
// Returns tags derived from the memo body by intersecting with the
// provided vocabulary. Satisfies the TaggerPort contract.

import type { TaggerPort, TaggerOptions } from "@ports/tagger.port";
import type { Memo } from "@domain/memo";
import type { Tag } from "@domain/tag";
import { corpusVocabulary, deriveTags } from "@domain/tag";

export class FakeTagger implements TaggerPort {
  private readonly fixedVocabulary: ReadonlySet<string> | null;
  constructor(opts?: { vocabulary?: ReadonlySet<string> }) {
    this.fixedVocabulary = opts?.vocabulary ?? null;
  }

  async tag(memo: Memo, opts?: TaggerOptions): Promise<ReadonlyArray<Tag>> {
    const vocab = opts?.vocabulary ?? this.fixedVocabulary ?? corpusVocabulary();
    const max = opts?.maxTags ?? 5;
    return deriveTags(memoSearchableText(memo), vocab).slice(0, max);
  }
}

function memoSearchableText(m: Memo): string {
  return [m.title, m.body, m.summary ?? ""].join("\n");
}
