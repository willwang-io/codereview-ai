import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}