import { NextRequest, NextResponse } from "next/server";
import { discoverAnime } from "@/lib/anilist";
import { MOODS, LENGTHS } from "@/lib/moods";

export async function GET(req: NextRequest) {
  const moodId = req.nextUrl.searchParams.get("mood") ?? "";
  const lengthId = req.nextUrl.searchParams.get("length") ?? "any";
  const genre = req.nextUrl.searchParams.get("genre")?.trim() || null;
  const sort = (req.nextUrl.searchParams.get("sort") === "popular" ? "popular" : "score") as
    | "popular"
    | "score";
  const minScore = Math.max(0, Number(req.nextUrl.searchParams.get("minScore") ?? 70));

  const mood = MOODS.find((m) => m.id === moodId);
  const length = LENGTHS.find((l) => l.id === lengthId) ?? LENGTHS[0];
  if (!mood) {
    return NextResponse.json({ error: "Unknown mood" }, { status: 400 });
  }

  const startersOnly = req.nextUrl.searchParams.get("starters") === "1";

  const results = await discoverAnime({
    tags: mood.tags,
    genre,
    format: length.format,
    maxEpisodes: length.maxEpisodes,
    minScore,
    sort,
    limit: 24,
    startersOnly,
  });

  return NextResponse.json({ mood: mood.label, results });
}
