// Watch-order resolution — our signature feature. (AniList edition)
//
// Strategy:
//   1. If a curated override exists for this franchise, use it verbatim.
//   2. Otherwise walk AniList's relation graph: follow SEQUEL/PREQUEL edges
//      to build the main story chain; SIDE_STORY/SUMMARY become optional.
//      Everything is sorted by air date into a single release timeline.

import { cacheGet, cacheSet, TTL } from "./cache";
import { getCuratedWatchOrder } from "./curated";
import type { WatchOrder, WatchOrderStep, WatchRole } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ENDPOINT = "https://graphql.anilist.co";
const MAX_NODES = 20;

async function fetchBasic(id: number): Promise<any | null> {
  const key = `al-basic:${id}`;
  const cached = cacheGet<any>(key);
  if (cached) return cached;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id title { romaji english } coverImage { medium }
              averageScore episodes format seasonYear
              startDate { year month day }
              relations { edges { relationType node { id type } } }
            }
          }`,
          variables: { id },
        }),
        next: { revalidate: 86400 },
      });
      if (res.ok) {
        const data = (await res.json()).data?.Media;
        if (data) {
          cacheSet(key, data, TTL.anime);
          return data;
        }
        return null;
      }
      if (res.status === 404 || res.status === 400) return null;
      if (res.status === 429) {
        const retry = Number(res.headers.get("retry-after") ?? 2);
        await new Promise((r) => setTimeout(r, retry * 1000));
        continue;
      }
    } catch {
      // network error — retry
    }
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  return null;
}

function toStep(a: any, role: WatchRole, currentId: number, note: string | null = null): WatchOrderStep {
  return {
    animeId: a.id,
    title: a.title?.english ?? a.title?.romaji ?? "Unknown",
    image: a.coverImage?.medium ?? null,
    type: a.format ?? null,
    episodes: a.episodes ?? null,
    year: a.seasonYear ?? a.startDate?.year ?? null,
    rating: a.averageScore != null ? a.averageScore / 10 : null,
    role,
    note,
    isCurrent: a.id === currentId,
  };
}

function airedMs(a: any): number {
  return a.startDate?.year
    ? new Date(a.startDate.year, (a.startDate.month ?? 1) - 1, a.startDate.day ?? 1).getTime()
    : Number.MAX_SAFE_INTEGER;
}

const MAIN_EDGES = new Set(["SEQUEL", "PREQUEL"]);
const OPTIONAL_EDGES = new Set(["SIDE_STORY", "SUMMARY", "OTHER"]);

interface BuildResult {
  order: WatchOrder;
  incomplete: boolean; // some fetches failed — don't cache long
}

async function autoWatchOrder(rootId: number): Promise<BuildResult | null> {
  const root = await fetchBasic(rootId);
  if (!root) return null;

  const main = new Map<number, any>([[rootId, root]]);
  const optional = new Map<number, any>();
  let incomplete = false;

  // BFS over SEQUEL/PREQUEL edges only — that defines the main story chain
  const queue: number[] = [rootId];
  while (queue.length > 0 && main.size < MAX_NODES) {
    const id = queue.shift()!;
    const node = main.get(id);
    for (const edge of node?.relations?.edges ?? []) {
      if (edge.node?.type !== "ANIME") continue;
      const eid = edge.node.id as number;
      if (MAIN_EDGES.has(edge.relationType)) {
        if (!main.has(eid) && main.size < MAX_NODES) {
          const data = await fetchBasic(eid);
          if (data) {
            main.set(eid, data);
            queue.push(eid);
          } else {
            incomplete = true;
          }
        }
      } else if (OPTIONAL_EDGES.has(edge.relationType) && !optional.has(eid) && !main.has(eid)) {
        const data = await fetchBasic(eid);
        if (data) optional.set(eid, data);
        else incomplete = true;
      }
    }
  }

  const steps: WatchOrderStep[] = [
    ...[...main.values()].map((a) => toStep(a, "main", rootId)),
    ...[...optional.values()].map((a) => toStep(a, "optional", rootId, "Optional")),
  ].sort((a, b) => {
    const am = main.get(a.animeId) ?? optional.get(a.animeId);
    const bm = main.get(b.animeId) ?? optional.get(b.animeId);
    return airedMs(am) - airedMs(bm);
  });

  // Mark the earliest main entry as the starting point
  const firstMain = steps.find((s) => s.role === "main");
  if (firstMain && !firstMain.isCurrent) firstMain.note = "Start here";

  if (steps.length <= 1) return null;

  return {
    order: {
      franchiseName: root.title?.english ?? root.title?.romaji ?? "This series",
      curated: false,
      steps,
    },
    incomplete,
  };
}

async function curatedWatchOrder(rootId: number): Promise<BuildResult | null> {
  const curated = getCuratedWatchOrder(rootId);
  if (!curated) return null;

  const steps: WatchOrderStep[] = [];
  let incomplete = false;
  for (const s of curated.steps) {
    const data = await fetchBasic(s.animeId);
    if (!data) {
      incomplete = true;
      continue;
    }
    steps.push(toStep(data, s.role ?? "main", rootId, s.note ?? null));
  }
  if (steps.length === 0) return null;

  return { order: { franchiseName: curated.franchise, curated: true, steps }, incomplete };
}

export async function getWatchOrder(animeId: number): Promise<WatchOrder | null> {
  const key = `al-watchorder:${animeId}`;
  const cached = cacheGet<WatchOrder>(key);
  if (cached) return cached;

  const result = (await curatedWatchOrder(animeId)) ?? (await autoWatchOrder(animeId));
  if (!result) return null;
  // Partial results (upstream flakiness) get a short TTL so they self-heal
  cacheSet(key, result.order, result.incomplete ? TTL.search : TTL.anime);
  return result.order;
}
