"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
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
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => res.json())
      .then(setReview);
  }, [id]);

  const severityColor = {
    critical: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    suggestion: "bg-blue-100 text-blue-800 border-blue-300",
  };

  if (!review) return <div className="max-w-3xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/reviews" className="text-blue-600 hover:underline text-sm">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">
          {review.owner}/{review.repo} #{review.prNumber}
        </h1>
      </div>

      <a
        href={review.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        View PR on GitHub ↗
      </a>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h2 className="font-semibold mb-1">Summary</h2>
        <p className="text-gray-700">{review.summary}</p>
      </div>

      {review.findings.length === 0 ? (
        <p className="text-green-600 font-medium">No issues found.</p>
      ) : (
        <div className="space-y-3">
          {review.findings.map((f, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 ${severityColor[f.severity]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase">{f.severity}</span>
                {f.file && <span className="text-xs opacity-70">{f.file}</span>}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm mt-1">{f.description}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 mt-6">
        Reviewed on {new Date(review.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
