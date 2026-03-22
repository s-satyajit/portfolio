import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  contactBudgetValues,
  contactCategoryValues,
  contactPreferredContactValues,
  contactTimelineValues
} from "@/types/contact";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  category: z.enum(contactCategoryValues),
  message: z.string().trim().min(30).max(2000),
  organization: z.string().trim().max(120).optional().default(""),
  roleTitle: z.string().trim().max(120).optional().default(""),
  timeline: z.enum(contactTimelineValues).optional().default("flexible"),
  budget: z.enum(contactBudgetValues).optional().default("not-applicable"),
  preferredContact: z.enum(contactPreferredContactValues).optional().default("email"),
  consent: z.literal(true),
  startedAt: z.number().int().positive(),
  website: z.string().optional().default(""),
  fax: z.string().optional().default("")
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
    return NextResponse.json(
      { ok: false, message: "Please fill the form correctly." },
      { status: 400 }
    );
  }

  if (parsed.data.website || parsed.data.fax) {
    return NextResponse.json(
      { ok: true, message: "Message received. Thanks for reaching out." },
      { status: 200 }
    );
  }

  const elapsedMs = Date.now() - parsed.data.startedAt;
  if (elapsedMs < 4000) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please take a moment to provide context and submit again."
      },
      { status: 400 }
    );
  }

  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      category: parsed.data.category,
      message: parsed.data.message,
      organization: parsed.data.organization,
      roleTitle: parsed.data.roleTitle,
      timeline: parsed.data.timeline,
      budget: parsed.data.budget,
      preferredContact: parsed.data.preferredContact
    });
    return NextResponse.json(
      {
        ok: true,
        message: "Message sent successfully. I will get back to you soon."
      },
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
