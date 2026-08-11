import Link from "next/link";

export interface HeaderProps {
  signedIn?: boolean;
  userLabel?: string;
}

export function Header({ signedIn = false, userLabel }: HeaderProps) {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold">01-ai-memo</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/memos" className="hover:underline">Memos</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          {signedIn ? (
            <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs dark:bg-neutral-800">
              {userLabel ?? "You"}
            </span>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
