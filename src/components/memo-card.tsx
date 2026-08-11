import Link from "next/link";
import type { Tag } from "@domain/tag";

export interface MemoCardProps {
  id: string;
  title: string;
  body: string;
  tags?: ReadonlyArray<Tag>;
}

export function MemoCard({ id, title, body, tags = [] }: MemoCardProps) {
  return (
    <Link href={`/memos/${id}`} className="block rounded-md border border-neutral-200 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">{body}</p>
      {tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((t) => (
            <span key={t.value} className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs dark:bg-neutral-800">
              {t.value}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
