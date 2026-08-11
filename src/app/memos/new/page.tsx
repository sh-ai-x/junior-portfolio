import { redirect } from "next/navigation";
import { createMemoWithEnrichment } from "@lib/memo-service";
import { getContainer } from "@lib/container";

async function createMemoAction(formData: FormData) {
  "use server";
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  if (!title || !body) redirect("/memos/new");
  const c = getContainer();
  const m = await createMemoWithEnrichment({ title, body, ownerId: "demo-owner" }, c);
  redirect(`/memos/${m.id}`);
}

export default function NewMemoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">New memo</h1>
      <form action={createMemoAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">Title</label>
          <input
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium">Body</label>
          <textarea
            id="body"
            name="body"
            required
            rows={8}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </main>
  );
}
