"use client";
import { useState } from "react";

export interface SearchInputProps {
  onSearch?: (q: string) => void;
  initial?: string;
}

export function SearchInput({ onSearch, initial = "" }: SearchInputProps) {
  const [q, setQ] = useState(initial);
  return (
    <form
      role="search"
      onSubmit={(e) => { e.preventDefault(); onSearch?.(q); }}
      className="flex gap-2"
    >
      <label htmlFor="q" className="sr-only">Search</label>
      <input
        id="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search memos…"
        className="flex-1 rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
