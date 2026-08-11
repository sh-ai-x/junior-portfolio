import Link from "next/link";
import { getContainer } from "@lib/container";

export const dynamic = "force-dynamic";

export default async function MemosPage() {
  const c = getContainer();
  const memos = await c.repository.listByOwner("demo-owner", { limit: 50 });
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Memos</h1>
        <Link
          href="/memos/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New memo
        </Link>
      </div>
      {memos.length === 0 ? (
        <p className="text-neutral-500">No memos yet. Write your first one.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {memos.map((m) => (
            <li key={m.id} className="py-4">
              <Link href={`/memos/${m.id}`} className="block">
                <div className="font-medium">{m.title}</div>
                <div className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {m.body}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
