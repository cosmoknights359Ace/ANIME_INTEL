import { NextRequest, NextResponse } from "next/server";
import { searchAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ results: [], query: "" });
  }
  try {
    const results = await searchAnime(q);
    return NextResponse.json({ results, query: q });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
