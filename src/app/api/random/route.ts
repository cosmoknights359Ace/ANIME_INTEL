import { NextResponse } from "next/server";
import { getTopAnime } from "@/lib/anilist";

// "Surprise me": picks a random pick from the top 200 most popular anime.
export async function GET() {
  const pool = await getTopAnime(200).catch(() => []);
  if (pool.length === 0) {
    return NextResponse.json({ error: "Pool empty" }, { status: 502 });
  }
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.json({ id: pick.id, title: pick.title });
}
