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
    critical: "bg-[var(--error-bg)] text-[var(--error)] border-[var(--error)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]",
    suggestion: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]",
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] bg-clip-text text-transparent">
          CodeReview AI
        </h1>
        <p className="text-[var(--muted)] text-lg">
          Paste a GitHub PR URL to get an AI-powered code review
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-lg mb-8">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <p className="text-xs text-[var(--muted)] mt-2">
            Your key is sent directly to the API and never stored
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading || !url || !apiKey}
            className="bg-[var(--primary)] text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? "Reviewing..." : "Review PR"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-[var(--error-bg)] border border-[var(--error)] text-[var(--error)] p-4 rounded-lg mb-8 shadow-md">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {review && (
        <div className="space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-md">
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
              <p className="font-semibold text-lg">No issues found — looking good!</p>
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
        </div>
      )}
    </div>
  );
}
