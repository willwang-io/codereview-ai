"use client";

import { useState } from "react";

interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
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
    critical: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    suggestion: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">CodeReview AI</h1>
      <p className="text-gray-500 mb-6">
        Paste a GitHub PR URL to get an AI-powered code review.
      </p>
    <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Anthropic API Key
    </label>
    <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-ant-..."
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <p className="text-xs text-gray-400 mt-1">
        Your key is sent directly to the API and never stored.
    </p>
    </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !url || !apiKey }
          className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Reviewing..." : "Review"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {review && (
        <div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-1">Summary</h2>
            <p className="text-gray-700">{review.summary}</p>
          </div>

          {review.findings.length === 0 ? (
            <p className="text-green-600 font-medium">
              No issues found — looking good!
            </p>
          ) : (
            <div className="space-y-3">
              {review.findings.map((f, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-4 ${severityColor[f.severity]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase">
                      {f.severity}
                    </span>
                    {f.file && (
                      <span className="text-xs opacity-70">{f.file}</span>
                    )}
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm mt-1">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}