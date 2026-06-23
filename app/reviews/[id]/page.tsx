"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
  line?: number;
  code_snippet?: string;
}

interface Review {
  id: string;
  url: string;
  owner: string;
  repo: string;
  refType?: "pull" | "commit";
  ref?: string;
  prNumber?: number;
  summary: string;
  findings: ReviewFinding[];
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

export default function ReviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then(setReview);
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    router.push("/reviews");
  }

  const severityColor = {
    critical: "bg-[var(--error-bg)] border-[var(--error)] text-[var(--error)]",
    warning: "bg-[var(--warning-bg)] border-[var(--warning)] text-[var(--warning)]",
    suggestion: "bg-[var(--info-bg)] border-[var(--info)] text-[var(--info)]",
  };

  if (!review)
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-pulse">
          <div className="h-7 bg-[var(--surface)] rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-[var(--surface)] rounded w-2/3"></div>
        </div>
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/reviews"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm"
          >
            Back
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          {review.owner}/{review.repo}{" "}
          <span className="text-[var(--muted)]">{formatTargetLabel(review)}</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Reviewed on {new Date(review.createdAt).toLocaleString()}
        </p>
      </header>

      <div className="flex items-center gap-4 mb-6">
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] text-sm"
        >
          View on GitHub
        </a>
        <button
          onClick={handleDelete}
          className="text-[var(--error)] text-sm"
        >
          Delete
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-6">
        <h2 className="font-semibold text-[var(--foreground)] mb-2">Summary</h2>
        <p className="text-[var(--foreground)] leading-relaxed">{review.summary}</p>
      </div>

      {review.findings.length === 0 ? (
        <div className="bg-[var(--success-bg)] border border-[var(--success)] text-[var(--success)] p-4 rounded-md text-sm">
          No issues found. Suspiciously peaceful.
        </div>
      ) : (
        <div className="space-y-3">
          {review.findings.map((f, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 ${severityColor[f.severity]}`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase">
                  {f.severity}
                </span>
                {f.file && (
                  <span className="text-xs font-mono text-[var(--muted)]">
                    {f.file}
                  </span>
                )}
                {f.line && (
                  <span className="text-xs font-mono text-[var(--muted)]">
                    Line {f.line}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--foreground)]">{f.description}</p>
              {f.code_snippet && (
                <pre className="mt-3 p-3 bg-black/10 rounded-md text-xs overflow-x-auto font-mono">
                  <code>{f.code_snippet}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
