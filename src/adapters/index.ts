// Adapter layer barrel. Imports concrete adapters + fakes; nothing else
// in the system depends on this file directly — wiring happens at the
// composition root in src/lib/container.ts.

export * from "./openai-tagger";
export * from "./openai-embedder";
export * from "./pgvector-repo";
export * from "./fakes/fake-tagger";
export * from "./fakes/fake-embedder";
export * from "./fakes/fake-repository";
export * from "./fakes/fake-search";
