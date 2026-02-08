import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="font-bold text-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        CodeReview AI
      </Link>
      <Link href="/reviews" className="text-sm text-[var(--muted)] hover:text-[var(--primary)] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[var(--primary-light)]">
        History
      </Link>
    </nav>
  );
}