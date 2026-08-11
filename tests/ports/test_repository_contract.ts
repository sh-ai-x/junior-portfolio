// Contract suite for MemoRepositoryPort.
// Same suite must pass for FakeMemoRepository and PgvectorRepository.
//
// Invariants covered:
//   1. save() then findById() returns the same memo
//   2. findById() of unknown id returns null
//   3. listByOwner() returns all saved memos
//   4. listByOwner() respects limit and offset
//   5. deleteById() returns true when row existed
//   6. deleteById() returns false when id was unknown
//   7. save() overwrites existing memo by id

import { describe, it, expect, beforeEach } from "vitest";
import { FakeMemoRepository } from "@adapters/fakes/fake-repository";
import { createMemo } from "@domain/memo";
import type { MemoRepositoryPort } from "@ports/repository.port";

describe("MemoRepositoryPort contract", () => {
  let repo: MemoRepositoryPort;
  beforeEach(() => {
    repo = new FakeMemoRepository();
  });

  it("contract 1 — save then findById round-trip", async () => {
    const m = createMemo({ id: "abc", title: "T", body: "B" });
    await repo.save(m);
    const got = await repo.findById(m.id);
    expect(got).not.toBeNull();
    expect(got!.id).toBe(m.id);
    expect(got!.title).toBe(m.title);
  });

  it("contract 2 — findById of unknown id returns null", async () => {
    const got = await repo.findById("nope" as never);
    expect(got).toBeNull();
  });

  it("contract 3 — listByOwner returns all saved memos", async () => {
    const m1 = createMemo({ id: "1", title: "T1", body: "B1" });
    const m2 = createMemo({ id: "2", title: "T2", body: "B2" });
    await repo.save(m1);
    await repo.save(m2);
    const all = await repo.listByOwner("any-owner");
    expect(all.length).toBe(2);
  });

  it("contract 4 — listByOwner respects limit and offset", async () => {
    for (let i = 0; i < 5; i++) {
      await repo.save(createMemo({ id: `id-${i}`, title: `T${i}`, body: `B${i}` }));
    }
    const page1 = await repo.listByOwner("any-owner", { limit: 2, offset: 0 });
    expect(page1.length).toBe(2);
    const page2 = await repo.listByOwner("any-owner", { limit: 2, offset: 2 });
    expect(page2.length).toBe(2);
    expect(page1[0]!.id).not.toBe(page2[0]!.id);
  });

  it("contract 5 — deleteById returns true when row existed", async () => {
    const m = createMemo({ id: "x", title: "T", body: "B" });
    await repo.save(m);
    const removed = await repo.deleteById(m.id);
    expect(removed).toBe(true);
  });

  it("contract 6 — deleteById returns false when id was unknown", async () => {
    const removed = await repo.deleteById("nope" as never);
    expect(removed).toBe(false);
  });

  it("contract 7 — save overwrites existing memo by id", async () => {
    const m1 = createMemo({ id: "x", title: "Old", body: "Old" });
    const m2 = createMemo({ id: "x", title: "New", body: "New" });
    await repo.save(m1);
    await repo.save(m2);
    const got = await repo.findById("x" as never);
    expect(got!.title).toBe("New");
  });
});
