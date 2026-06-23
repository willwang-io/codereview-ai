import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
        CodeReview AI
      </Link>
      <Link href="/reviews" className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">
        History
      </Link>
    </nav>
  );
}
