import type { Tag } from "@domain/tag";

export interface TagPreviewProps {
  tags: ReadonlyArray<Tag>;
}

export function TagPreview({ tags }: TagPreviewProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-neutral-500">No tags yet.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2" aria-label="tag-preview">
      {tags.map((t) => (
        <li key={t.value} className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
          {t.value}
        </li>
      ))}
    </ul>
  );
}
