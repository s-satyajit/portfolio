import { NextRequest, NextResponse } from "next/server";

import { getContributionsPayload } from "@/lib/github";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") || "s-satyajit";
  const payload = await getContributionsPayload(username);
  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=1800"
    }
  });
}
