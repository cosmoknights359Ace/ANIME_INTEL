import { NextResponse } from "next/server";
import { getTopAnime } from "@/lib/anilist";

export async function GET() {
  try {
    const results = await getTopAnime(10);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Failed to load top anime" }, { status: 502 });
  }
}
