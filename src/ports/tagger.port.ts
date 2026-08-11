// Port: TaggerPort — converts a Memo into a set of Tags via LLM.
// Both the real OpenAI adapter and the FakeTagger (used in tests)
// must satisfy this contract.

import type { Memo } from "@domain/memo";
import type { Tag } from "@domain/tag";

export interface TaggerPort {
  /**
   * Produce a deduplicated list of tags for the given memo. Implementations
   * SHOULD return at most `maxTags` items, but the contract permits any
   * length >= 0. Tags MUST be drawn from the caller's vocabulary if the
   * caller provides one (closed-world); otherwise the implementation MAY
   * mint new tags.
   *
   * Throws on transport errors. Caller handles retry.
   */
  tag(memo: Memo, opts?: TaggerOptions): Promise<ReadonlyArray<Tag>>;
}

export interface TaggerOptions {
  readonly maxTags?: number;
  readonly vocabulary?: ReadonlySet<string>;
}

export const TAGGER_PORT = Symbol.for("01-ai-memo/ports/tagger");
