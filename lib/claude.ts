import Anthropic from "@anthropic-ai/sdk";

export interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
  line?: number;
}

export interface ReviewResult {
  summary: string;
  findings: ReviewFinding[];
}

export async function reviewDiff(diff: string, apiKey: string): Promise<ReviewResult> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Review the following code diff. Identify bugs, security issues, style problems, and improvements.

Respond ONLY with a JSON object in this exact format, no markdown backticks:
{
  "summary": "Brief overall assessment",
  "findings": [
    {
      "severity": "critical" | "warning" | "suggestion",
      "title": "Short title",
      "description": "Detailed explanation and suggested fix",
      "file": "filename if identifiable",
      "line": null
    }
  ]
}

If the code looks good, return an empty findings array with a positive summary.

Diff:
${diff}`,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return JSON.parse(text) as ReviewResult;
}