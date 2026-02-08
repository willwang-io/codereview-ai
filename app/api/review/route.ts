import { NextRequest, NextResponse } from "next/server";
import { fetchDiff, parsePRUrl } from "@/lib/github";
import { reviewDiff } from "@/lib/claude";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { url, apiKey } = await req.json();
    if (!url || !apiKey) {
      return NextResponse.json({ error: "URL and API key are required" }, { status: 400 });
    }

    const prInfo = parsePRUrl(url);
    const diff = await fetchDiff(url);
    const review = await reviewDiff(diff, apiKey);

    const saved = await prisma.review.create({
      data: {
        url,
        owner: prInfo.owner,
        repo: prInfo.repo,
        prNumber: prInfo.number,
        summary: review.summary,
        findings: review.findings as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      id: saved.id,
      url,
      review,
      createdAt: saved.createdAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}