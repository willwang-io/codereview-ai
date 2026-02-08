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
  prNumber: number;
  summary: string;
  findings: ReviewFinding[];
  createdAt: string;
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
    critical: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]",
    suggestion: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]",
  };

  if (!review)
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--surface)] rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-[var(--surface)] rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/reviews"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--primary-light)] transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            {review.owner}/{review.repo}{" "}
            <span className="text-[var(--muted)]">#{review.prNumber}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--primary-light)] transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View on GitHub
        </a>
        <button
          onClick={handleDelete}
          className="text-[var(--error)] hover:text-[var(--error)] font-medium text-sm flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[var(--error-bg)] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-md mb-8">
        <h2 className="font-bold text-lg text-[var(--foreground)] mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Summary
        </h2>
        <p className="text-[var(--foreground)] leading-relaxed">{review.summary}</p>
      </div>

      {review.findings.length === 0 ? (
        <div className="bg-[var(--success-bg)] border border-[var(--success)] text-[var(--success)] p-6 rounded-xl text-center shadow-md">
          <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="font-semibold text-lg">No issues found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {review.findings.map((f, i) => (
            <div
              key={i}
              className={`border rounded-xl p-5 shadow-md ${severityColor[f.severity]}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-black/10">
                  {f.severity}
                </span>
                {f.file && (
                  <span className="text-xs font-mono opacity-70 bg-black/5 px-2 py-1 rounded">
                    {f.file}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed">{f.description}</p>
              {f.code_snippet && (
                <pre className="mt-3 p-3 bg-black/10 rounded-lg text-xs overflow-x-auto font-mono">
                  <code>{f.code_snippet}</code>
                </pre>
              )}
              {f.line && (
                <span className="text-xs opacity-60 mt-2 block font-mono">
                  Line {f.line}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-[var(--muted)] mt-8 text-center">
        Reviewed on {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );
}