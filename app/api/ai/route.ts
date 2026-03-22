import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generatePortfolioAnswer } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";
import { AIRequestBody } from "@/types/ai";

const requestSchema = z.object({
  query: z.string().min(3).max(500),
  persona: z.enum(["recruiter", "client", "collaborator", "general"]).optional(),
  mode: z
    .enum([
      "homepage",
      "recruiter",
      "project",
      "about",
      "contact",
      "resume",
      "blog",
      "research",
      "case-study",
      "insights",
      "services",
      "experience"
    ])
    .optional(),
  projectSlug: z.string().min(1).max(120).optional(),
  entrySlug: z.string().min(1).max(160).optional()
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

  if (parsed.data.mode === "project" && !parsed.data.projectSlug) {
    return NextResponse.json(
      { message: "Project slug is required for project mode." },
      { status: 400 }
    );
  }

  if (
    (parsed.data.mode === "blog" ||
      parsed.data.mode === "research" ||
      parsed.data.mode === "case-study") &&
    !parsed.data.entrySlug
  ) {
    return NextResponse.json(
      { message: "Entry slug is required for this page mode." },
      { status: 400 }
    );
  }

  const result = await generatePortfolioAnswer(parsed.data.query, {
    persona: parsed.data.persona,
    mode: parsed.data.mode,
    projectSlug: parsed.data.projectSlug,
    entrySlug: parsed.data.entrySlug
  });
  return NextResponse.json(result, { status: 200 });
}
