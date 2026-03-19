import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateBlogAI } from "@/lib/blog-ai";
import { checkRateLimit } from "@/lib/rate-limit";

const blogAIRequestSchema = z.object({
  slug: z.string().min(1),
  mode: z.enum(["summary", "takeaways", "simple", "faq", "ask"]),
  question: z.string().max(300).optional()
});

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local";
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`blog-ai:${clientKey(request)}`, 30, 60 * 60 * 1000);
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

  const parsed = blogAIRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid blog AI request." }, { status: 400 });
  }

  if (parsed.data.mode === "ask" && !parsed.data.question?.trim()) {
    return NextResponse.json({ message: "Question is required for ask mode." }, { status: 400 });
  }

  try {
    const answer = await generateBlogAI(parsed.data);
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
