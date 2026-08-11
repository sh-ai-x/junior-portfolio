import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">01-ai-memo</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-300">
        AI-powered memo app. Write a note, get auto-tags + a summary,
        and search semantically across everything you&apos;ve written.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/memos"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Open memos
        </Link>
        <Link
          href="/search"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Search
        </Link>
      </div>
    </main>
  );
}
