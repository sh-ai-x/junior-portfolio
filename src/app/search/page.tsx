import { getContainer } from "@lib/container";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const c = getContainer();
  let results: ReadonlyArray<{ id: string; title: string }> = [];
  if (q && q.length > 0) {
    const emb = await c.embedder.embed(q);
    const top = await c.search.query(emb, 10);
    results = top.map((m) => ({ id: m.id, title: m.title }));
  }
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Search</h1>
      <form action="/search" method="get" className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="What are you looking for?"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>
      {q ? (
        <section className="mt-6">
          <p className="text-sm text-neutral-500">
            {results.length} result{results.length === 1 ? "" : "s"} for &quot;{q}&quot;
          </p>
          <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
            {results.map((r) => (
              <li key={r.id} className="py-3">
                <a href={`/memos/${r.id}`} className="block font-medium hover:underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
