import OpenAI from "openai";

export interface ReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file?: string;
  line?: number;
  code_snippet?: string;
}

export interface ReviewResult {
  summary: string;
  findings: ReviewFinding[];
}

interface StructuredReviewFinding {
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
  file: string | null;
  line: number | null;
  code_snippet: string | null;
}

interface StructuredReviewResult {
  summary: string;
  findings: StructuredReviewFinding[];
}

const reviewSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "findings"],
  properties: {
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "title", "description", "file", "line", "code_snippet"],
        properties: {
          severity: {
            type: "string",
            enum: ["critical", "warning", "suggestion"],
          },
          title: { type: "string" },
          description: { type: "string" },
          file: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
          line: {
            anyOf: [{ type: "integer" }, { type: "null" }],
          },
          code_snippet: {
            anyOf: [{ type: "string" }, { type: "null" }],
          },
        },
      },
    },
  },
} as const;

function normalizeReview(review: StructuredReviewResult): ReviewResult {
  return {
    summary: review.summary,
    findings: review.findings.map((finding) => ({
      severity: finding.severity,
      title: finding.title,
      description: finding.description,
      file: finding.file ?? undefined,
      line: finding.line ?? undefined,
      code_snippet: finding.code_snippet ?? undefined,
    })),
  };
}

export async function reviewDiff(diff: string, apiKey: string): Promise<ReviewResult> {
  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: "gpt-5.5",
    instructions:
      "You are a senior software engineer reviewing a GitHub diff. Identify bugs, security issues, style problems, and meaningful improvements. If the code looks good, return an empty findings array with a positive summary.",
    input: `Review the following code diff:\n\n${diff}`,
    max_output_tokens: 4096,
    text: {
      format: {
        type: "json_schema",
        name: "code_review",
        strict: true,
        schema: reviewSchema,
      },
    },
  });

  return normalizeReview(JSON.parse(response.output_text) as StructuredReviewResult);
}
