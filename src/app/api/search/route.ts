import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ results: [], query: "" });
  }
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("p") ?? 1));
  const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? 48));
  try {
    const results = await searchAnime(q, limit, page);
    return NextResponse.json({ results, query: q });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
