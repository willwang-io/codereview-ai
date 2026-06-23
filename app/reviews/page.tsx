"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  url: string;
  owner: string;
  repo: string;
  refType?: "pull" | "commit";
  ref?: string;
  prNumber?: number;
  summary: string;
  findings: { severity: string }[];
  createdAt: string;
}

function formatTargetLabel(review: Review): string {
  if (review.refType === "commit" && review.ref) {
    return review.ref.slice(0, 7);
  }

  if (review.refType === "pull" && review.ref) {
    return `#${review.ref}`;
  }

  return review.prNumber ? `#${review.prNumber}` : "Review";
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          History
        </h1>
        <Link
          href="/"
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm"
        >
          New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface)]">
          <p className="text-[var(--foreground)] font-medium">No reviews yet</p>
          <p className="text-[var(--muted)] text-sm mt-1">The toolbox is empty. Disturbing, but fixable.</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg bg-[var(--surface)]">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/reviews/${r.id}`}
              className="block p-4 hover:bg-[var(--primary-light)]"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-[var(--foreground)] mb-1">
                    {r.owner}/{r.repo} <span className="text-[var(--muted)]">{formatTargetLabel(r)}</span>
                  </p>
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {r.summary}
                  </p>
                </div>
                <div className="text-right text-sm flex flex-col gap-1 items-end flex-shrink-0">
                  <span className="text-[var(--muted)]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[var(--muted)] text-xs">
                    {r.findings.length} finding{r.findings.length !== 1 && "s"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
