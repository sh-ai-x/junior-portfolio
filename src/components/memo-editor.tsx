"use client";
import { useState } from "react";
import type { Tag } from "@domain/tag";

export interface MemoEditorProps {
  initialTitle?: string;
  initialBody?: string;
  initialTags?: ReadonlyArray<Tag>;
  onSubmit?: (data: { title: string; body: string }) => Promise<void>;
}

export function MemoEditor({ initialTitle = "", initialBody = "", onSubmit }: MemoEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSubmit) {
      setSubmitting(true);
      try { await onSubmit({ title, body }); }
      finally { setSubmitting(false); }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="memo-editor">
      <div>
        <label htmlFor="memo-title" className="block text-sm font-medium">Title</label>
        <input
          id="memo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <div>
        <label htmlFor="memo-body" className="block text-sm font-medium">Body</label>
        <textarea
          id="memo-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={8}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
