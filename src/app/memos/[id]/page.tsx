import { notFound } from "next/navigation";
import Link from "next/link";
import { getContainer } from "@lib/container";

export const dynamic = "force-dynamic";

export default async function MemoDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getContainer();
  const memo = await c.repository.findById(id as never);
  if (!memo) notFound();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/memos" className="text-sm text-blue-600 hover:underline">
        ← Back to memos
      </Link>
      <h1 className="mt-3 text-2xl font-semibold">{memo.title}</h1>
      <p className="mt-4 whitespace-pre-wrap text-neutral-800 dark:text-neutral-100">
        {memo.body}
      </p>
      {memo.summary ? (
        <section className="mt-6 rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900">
          <strong>Summary:</strong> {memo.summary}
        </section>
      ) : null}
      {memo.tags.length > 0 ? (
        <section className="mt-6 flex flex-wrap gap-2">
          {memo.tags.map((t) => (
            <span
              key={t.value}
              className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium dark:bg-neutral-800"
            >
              {t.value}
            </span>
          ))}
        </section>
      ) : null}
    </main>
  );
}
