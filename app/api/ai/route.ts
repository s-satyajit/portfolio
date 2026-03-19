import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generatePortfolioAnswer } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { AIRequestBody } from "@/types/ai";

const requestSchema = z.object({
  query: z.string().min(3).max(500),
  persona: z.enum(["recruiter", "client", "collaborator", "general"]).optional()
});

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local";
}

export async function POST(request: NextRequest) {
  const clientKey = `ai:${getClientKey(request)}`;
  const rate = checkRateLimit(clientKey, 25, 60 * 60 * 1000);

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Rate limit exceeded. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter || 30) } }
    );
  }

  let body: AIRequestBody;
  try {
    body = (await request.json()) as AIRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request input." }, { status: 400 });
  }

  const result = await generatePortfolioAnswer(parsed.data.query, parsed.data.persona);
  return NextResponse.json(result, { status: 200 });
}
