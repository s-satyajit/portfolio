import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateInsightsAI } from "@/lib/insights-ai";
import { checkRateLimit } from "@/lib/rate-limit";

const insightAIRequestSchema = z.object({
  kind: z.enum(["hub", "research", "case-study"]),
  slug: z.string().min(1).optional(),
  mode: z.enum(["summary", "key-points", "simplify", "next-read", "ask"]),
  question: z.string().max(400).optional()
});

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local";
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`insights-ai:${clientKey(request)}`, 30, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = insightAIRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid insights AI request." }, { status: 400 });
  }

  if ((parsed.data.kind === "research" || parsed.data.kind === "case-study") && !parsed.data.slug) {
    return NextResponse.json({ message: "Slug is required for entry mode." }, { status: 400 });
  }

  if (parsed.data.mode === "ask" && !parsed.data.question?.trim()) {
    return NextResponse.json({ message: "Question is required for ask mode." }, { status: 400 });
  }

  try {
    const answer = await generateInsightsAI(parsed.data);
    return NextResponse.json({ answer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Unable to process request."
      },
      { status: 500 }
    );
  }
}
