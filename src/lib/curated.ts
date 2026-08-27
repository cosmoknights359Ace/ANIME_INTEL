// Our curated layer — hand-maintained data that differentiates us from
// MAL/AniList. Taste tags and (later) watch-order overrides live as plain
// JSON in data/curated/. Merged into API responses here.

import fs from "fs";
import path from "path";

const CURATED_DIR = path.join(process.cwd(), "data", "curated");

export function getTasteTags(animeId: number): string[] {
  const file = path.join(CURATED_DIR, "taste-tags", `${animeId}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data.tags) ? data.tags : [];
  } catch {
    return [];
  }
}

export interface CuratedWatchOrderStep {
  animeId: number;
  note?: string;
  role?: "main" | "optional";
}

export interface CuratedWatchOrder {
  franchise: string;
  appliesTo: number[];
  steps: CuratedWatchOrderStep[];
}

// Find a curated watch order for any franchise entry. Files in
// data/curated/watch-orders/ each declare which MAL ids they apply to.
export function getCuratedWatchOrder(animeId: number): CuratedWatchOrder | null {
  const dir = path.join(CURATED_DIR, "watch-orders");
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return null;
  }
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      if (Array.isArray(data.appliesTo) && data.appliesTo.includes(animeId)) {
        return data as CuratedWatchOrder;
      }
    } catch {
      // skip malformed curated file
    }
  }
  return null;
}
