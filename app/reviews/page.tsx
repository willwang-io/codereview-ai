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
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Review History</h1>
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          ← New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/reviews/${r.id}`}
              className="block border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {r.owner}/{r.repo} #{r.prNumber}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{r.summary}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>{new Date(r.createdAt).toLocaleDateString()}</p>
                  <p className="mt-1">
                    {r.findings.length} finding{r.findings.length !== 1 && "s"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}