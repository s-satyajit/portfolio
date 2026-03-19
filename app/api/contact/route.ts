import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  category: z.enum([
    "job-opportunity",
    "freelance-project",
    "collaboration",
    "general-message"
  ]),
  message: z.string().min(20).max(2000),
  company: z.string().optional().default(""),
  website: z.string().optional().default("")
});

function getClientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local";
}

export async function POST(request: NextRequest) {
  const clientKey = `contact:${getClientKey(request)}`;
  const rate = checkRateLimit(clientKey, 6, 10 * 60 * 1000);

  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many messages. Please retry in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please fill the form correctly." }, { status: 400 });
  }

  // Honeypot trap for bots.
  if (parsed.data.company || parsed.data.website) {
    return NextResponse.json(
      { ok: true, message: "Message received. Thanks for reaching out." },
      { status: 200 }
    );
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      category: parsed.data.category,
      message: parsed.data.message
    });
    return NextResponse.json(
      { ok: true, message: "Message sent successfully. I will get back to you soon." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Message could not be sent right now. Please try again shortly."
      },
      { status: 500 }
    );
  }
}
