"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  url: string;
  owner: string;
  repo: string;
  prNumber: number;
  summary: string;
  findings: { severity: string }[];
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent">
          Review History
        </h1>
        <Link
          href="/"
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--primary-light)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
          <svg className="w-16 h-16 mx-auto text-[var(--muted)] mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-[var(--muted)] text-lg">No reviews yet</p>
          <p className="text-[var(--muted)] text-sm mt-2">Start by reviewing your first pull request</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/reviews/${r.id}`}
              className="block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <p className="font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-2">
                    {r.owner}/{r.repo} <span className="text-[var(--muted)]">#{r.prNumber}</span>
                  </p>
                  <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {r.summary}
                  </p>
                </div>
                <div className="text-right text-sm flex flex-col gap-2 items-end flex-shrink-0">
                  <span className="text-[var(--muted)] font-medium">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full font-semibold text-xs">
                    {r.findings.length} finding{r.findings.length !== 1 && "s"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}