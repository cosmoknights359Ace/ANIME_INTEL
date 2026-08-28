import { NextRequest, NextResponse } from "next/server";
import { getGenreAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const g = req.nextUrl.searchParams.get("g")?.trim();
  if (!g) {
    return NextResponse.json({ results: [], genre: "" });
  }
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("p") ?? 1));
  const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? 48));
  try {
    const results = await getGenreAnime(g, limit, page);
    return NextResponse.json({ results, genre: g });
  } catch {
    return NextResponse.json({ error: "Genre fetch failed" }, { status: 502 });
  }
}
