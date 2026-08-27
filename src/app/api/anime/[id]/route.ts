import { NextRequest, NextResponse } from "next/server";
import { getAnimeDetail } from "@/lib/anilist";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const animeId = Number(id);
  if (!Number.isInteger(animeId) || animeId <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const anime = await getAnimeDetail(animeId);
  if (!anime) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(anime);
}
