import type { Tag } from "@domain/tag";

export interface SearchResult {
  id: string;
  title: string;
  tags?: ReadonlyArray<Tag>;
}

export interface SearchResultsProps {
  query: string;
  results: ReadonlyArray<SearchResult>;
}

export function SearchResults({ query, results }: SearchResultsProps) {
  if (!query) return null;
  if (results.length === 0) {
    return <p className="mt-4 text-sm text-neutral-500">No results for &quot;{query}&quot;.</p>;
  }
  return (
    <section aria-label="search-results" className="mt-4">
      <p className="text-sm text-neutral-500">
        {results.length} result{results.length === 1 ? "" : "s"} for &quot;{query}&quot;
      </p>
      <ul className="mt-2 divide-y divide-neutral-200 dark:divide-neutral-800">
        {results.map((r) => (
          <li key={r.id} className="py-2">
            <a href={`/memos/${r.id}`} className="font-medium hover:underline">{r.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
