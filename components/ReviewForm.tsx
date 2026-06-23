"use client";

import { useState } from "react";

interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
  line?: number;
  code_snippet?: string;
}

interface ReviewResult {
  summary: string;
  findings: ReviewFinding[];
}

export default function ReviewForm() {
  const [url, setUrl] = useState("");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReview(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReview(data.review);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const severityColor = {
    critical: "border-[var(--error)] bg-[var(--error-bg)] text-[var(--error)]",
    warning: "border-[var(--warning)] bg-[var(--warning-bg)] text-[var(--warning)]",
    suggestion: "border-[var(--info)] bg-[var(--info-bg)] text-[var(--info)]",
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--foreground)]">
          CodeReview AI
        </h1>
        <p className="text-[var(--muted)] mt-2">
          My personal, fast toolbox. Bring your own API key if you want to use it too.
        </p>
      </header>

      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <p className="text-xs text-[var(--muted)] mt-2">
              Sent for this request only. The app does not store it.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              GitHub URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo/commit/abc1234"
                className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="submit"
                disabled={loading || !url || !apiKey}
                className="bg-[var(--primary)] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Reviewing..." : "Review"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {error && (
        <div className="border border-[var(--error)] bg-[var(--error-bg)] text-[var(--error)] p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      {review && (
        <section className="space-y-5">
          <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--surface)]">
            <h2 className="font-semibold text-[var(--foreground)] mb-2">Summary</h2>
            <p className="text-[var(--foreground)] leading-relaxed">{review.summary}</p>
          </div>

          {review.findings.length === 0 ? (
            <div className="border border-[var(--success)] bg-[var(--success-bg)] text-[var(--success)] p-4 rounded-md text-sm">
              No issues found. Suspiciously peaceful.
            </div>
          ) : (
            <div className="space-y-3">
              {review.findings.map((finding, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${severityColor[finding.severity]}`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase">
                      {finding.severity}
                    </span>
                    {finding.file && (
                      <span className="text-xs font-mono text-[var(--muted)]">
                        {finding.file}
                      </span>
                    )}
                    {finding.line && (
                      <span className="text-xs font-mono text-[var(--muted)]">
                        Line {finding.line}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    {finding.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--foreground)]">
                    {finding.description}
                  </p>
                  {finding.code_snippet && (
                    <pre className="mt-3 p-3 bg-black/10 rounded-md text-xs overflow-x-auto font-mono">
                      <code>{finding.code_snippet}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
