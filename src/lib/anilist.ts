// AniList GraphQL API client + normalization.
// Everything AniList-shaped gets converted to our types HERE and nowhere else.
// No API key needed. Docs: https://docs.anilist.co/
// Note: AniList IDs match MAL IDs for most major titles, so the curated
// data layer (data/curated/) continues to work unchanged.

import { cacheGet, cacheSet, TTL } from "./cache";
import { getTasteTags } from "./curated";
import type {
  AnimeDetail,
  AnimeStatus,
  AnimeSummary,
  CharacterEntry,
  RelationEntry,
  StreamingLink,
} from "./types";

const ENDPOINT = "https://graphql.anilist.co";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const body = await res.json();
        return body.data as T;
      }
      if (res.status === 404 || res.status === 400) return null;
      if (res.status === 429) {
        // rate limited — honor the retry-after hint
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

function mapStatus(status: string | undefined): AnimeStatus {
  switch (status) {
    case "RELEASING":
      return "airing";
    case "FINISHED":
      return "finished";
    default:
      return "upcoming";
  }
}

function toSummary(m: any): AnimeSummary {
  return {
    id: m.id,
    title: m.title?.english ?? m.title?.romaji ?? "Unknown",
    titleEnglish: m.title?.english ?? null,
    titleJapanese: m.title?.native ?? null,
    image: m.coverImage?.extraLarge ?? m.coverImage?.large ?? null,
    rating: m.averageScore != null ? m.averageScore / 10 : null,
    scoredBy: m.stats?.scoreDistribution?.reduce((n: number, s: any) => n + s.amount, 0) ?? null,
    popularityRank: null, // AniList gives popularity as a count, not a rank
    status: mapStatus(m.status),
    episodes: m.episodes ?? null,
    type: m.format ?? null,
    year: m.seasonYear ?? null,
    genres: m.genres ?? [],
  };
}

const SUMMARY_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large }
  averageScore
  stats { scoreDistribution { amount } }
  status
  episodes
  format
  seasonYear
  genres
`;

export async function searchAnime(
  query: string,
  limit = 12,
  page = 1
): Promise<AnimeSummary[]> {
  const key = `al-search:${query.toLowerCase()}:${limit}:${page}`;
  const cached = cacheGet<AnimeSummary[]>(key);
  if (cached) return cached;

  const data = await gql<{ Page: { media: any[] } }>(
    `query ($search: String, $perPage: Int, $page: Int) {
      Page(perPage: $perPage, page: $page) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) { ${SUMMARY_FIELDS} synonyms }
      }
    }`,
    { search: query, perPage: limit, page }
  );
  if (!data) return [];

  const results = data.Page.media.map(toSummary);

  // AniList sorts purely by popularity, so exact matches for terse queries
  // ("86") can get buried under longer titles. Float exact/starts-with
  // matches (incl. synonyms) to the top, keeping popularity order otherwise.
  const q = query.trim().toLowerCase();
  const rank = (a: AnimeSummary & { synonyms?: string[] }) => {
    const names = [a.title, a.titleEnglish, a.titleJapanese, ...(a.synonyms ?? [])]
      .filter(Boolean)
      .map((n) => (n as string).toLowerCase());
    if (names.some((n) => n === q)) return 0;
    if (names.some((n) => n.startsWith(q))) return 1;
    return 2;
  };
  results.sort(
    (a, b) =>
      rank(a as AnimeSummary & { synonyms?: string[] }) -
      rank(b as AnimeSummary & { synonyms?: string[] })
  );

  cacheSet(key, results, TTL.search);
  return results;
}

export async function getTopAnime(limit = 10): Promise<AnimeSummary[]> {
  const key = `al-top:${limit}`;
  const cached = cacheGet<AnimeSummary[]>(key);
  if (cached) return cached;

  // AniList caps perPage at 50 — page through for larger limits
  const pages = Math.ceil(limit / 50);
  const results: AnimeSummary[] = [];
  for (let page = 1; page <= pages; page++) {
    const data = await gql<{ Page: { media: any[] } }>(
      `query ($perPage: Int, $page: Int) {
        Page(perPage: $perPage, page: $page) {
          media(type: ANIME, sort: SCORE_DESC) { ${SUMMARY_FIELDS} }
        }
      }`,
      { perPage: Math.min(50, limit - (page - 1) * 50), page }
    );
    if (!data) break;
    results.push(...data.Page.media.map(toSummary));
  }
  cacheSet(key, results, TTL.top);
  return results;
}

// Airing this week — the "is my show still on" section. Includes a few
// recently-finished shows so the row isn't empty between seasons.
export async function getSeasonAnime(limit = 12): Promise<AnimeSummary[]> {
  const key = `al-season:${limit}`;
  const cached = cacheGet<AnimeSummary[]>(key);
  if (cached) return cached;

  const now = new Date();
  const season = ["FALL", "WINTER", "SPRING", "SUMMER"][Math.floor(now.getMonth() / 3)];
  const year = now.getFullYear();

  const data = await gql<{ Page: { media: any[] } }>(
    `query ($season: MediaSeason, $seasonYear: Int, $perPage: Int) {
      Page(perPage: $perPage) {
        media(
          type: ANIME,
          season: $season,
          seasonYear: $seasonYear,
          isAdult: false,
          sort: POPULARITY_DESC
        ) { ${SUMMARY_FIELDS} }
      }
    }`,
    { season, seasonYear: year, perPage: limit }
  );
  if (!data) return [];

  const results = data.Page.media.filter((m) => m.status === "RELEASING").map(toSummary);
  cacheSet(key, results, TTL.top);
  return results;
}

export async function getGenreAnime(
  genre: string,
  limit = 24,
  page = 1
): Promise<AnimeSummary[]> {
  const key = `al-genre:${genre.toLowerCase()}:${limit}:${page}`;
  const cached = cacheGet<AnimeSummary[]>(key);
  if (cached) return cached;

  const escaped = genre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const data = await gql<{ Page: { media: any[] } }>(
    `query ($genre: String, $perPage: Int, $page: Int) {
      Page(perPage: $perPage, page: $page) {
        media(
          type: ANIME,
          isAdult: false,
          genre: $genre,
          sort: POPULARITY_DESC
        ) { ${SUMMARY_FIELDS} }
      }
    }`,
    { genre: escaped, perPage: limit, page }
  );
  if (!data) return [];

  const results = data.Page.media.map(toSummary);
  cacheSet(key, results, TTL.genre);
  return results;
}

// Phase 3 — guided discovery ("what should I watch?")
export interface DiscoverFilters {
  tags: string[]; // AniList genre/tag names (combined with OR)
  format?: string; // TV | MOVIE | TV_SHORT — undefined = any
  minScore?: number; // 0-100
  maxEpisodes?: number; // undefined = any length
  limit?: number;
  startersOnly?: boolean; // drop sequels — only franchise entry points
  genre?: string | null; // optional narrow genre override
  sort?: "score" | "popular";
}

export async function discoverAnime(f: DiscoverFilters): Promise<AnimeSummary[]> {
  const key = `al-discover:${JSON.stringify(f)}`;
  const cached = cacheGet<AnimeSummary[]>(key);
  if (cached) return cached;

  // genre_in and tag_in can't be OR-combined in one query, so query each
  // mood tag separately and merge. AniList tags contain spaces ("Battle
  // Royale") which media(search:) tokenizes into AND — wrong for us.
  const tags = f.genre ? [f.genre] : f.tags; // genre narrows to a single tag
  const sort =
    f.sort === "popular" ? "POPULARITY_DESC" : "SCORE_DESC";
  const perTag = await Promise.all(
    tags.map((tag) => {
      // AniList rejects explicit nulls for optional args — omit them instead
      const variables: Record<string, unknown> = { g: [tag], p: f.limit ?? 20 };
      if (f.format) variables.f = f.format;
      if (f.minScore != null) variables.s = f.minScore;
      if (f.maxEpisodes != null) variables.e = f.maxEpisodes;
      return gql<{ Page: { media: any[] } }>(
        `query ($g: [String], $f: MediaFormat, $s: Int, $e: Int, $p: Int) {
          Page(perPage: $p) {
            media(
              type: ANIME
              genre_in: $g
              format: $f
              averageScore_greater: $s
              episodes_lesser: $e
              sort: ${sort}
            ) {
              ${SUMMARY_FIELDS}
              relations { edges { relationType } }
            }
          }
        }`,
        variables
      );
    })
  );

  // merge, dedupe, keep best-rated
  const seen = new Map<number, AnimeSummary>();
  for (const d of perTag) {
    for (const m of d?.Page?.media ?? []) {
      // startersOnly: skip anything that has a prequel (it's a sequel)
      if (
        f.startersOnly &&
        m.relations?.edges?.some((e: any) => e.relationType === "PREQUEL")
      ) {
        continue;
      }
      const s = toSummary(m);
      if (!seen.has(s.id)) seen.set(s.id, s);
    }
  }
  // AniList already applies the server-side sort (score or popularity),
  // so we URL-dedupe and keep only `limit` of the top results.
  const results = [...seen.values()].slice(0, f.limit ?? 20);
  cacheSet(key, results, TTL.top);
  return results;
}

export async function getAnimeDetail(id: number): Promise<AnimeDetail | null> {
  const key = `al-anime:${id}`;
  const cached = cacheGet<AnimeDetail>(key);
  if (cached) return cached;

  const data = await gql<{ Media: any }>(
    `query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${SUMMARY_FIELDS}
        synonyms
        description(asHtml: false)
        duration
        startDate { year month day }
        endDate { year month day }
        season
        tags { name rank }
        source
        nextAiringEpisode { airingAt episode }
        studios(isMain: true) { nodes { name } }
        externalLinks { site url type }
        characters(sort: ROLE, perPage: 12) {
          edges {
            role
            node { name { full } image { medium } }
            voiceActors(language: JAPANESE) { name { full } }
          }
        }
        relations {
          edges {
            relationType
            node { id type title { romaji english } format }
          }
        }
      }
    }`,
    { id }
  );
  const m = data?.Media;
  if (!m) return null;

  const dateOrNull = (d: any): string | null =>
    d?.year ? `${d.year}-${String(d.month ?? 1).padStart(2, "0")}-${String(d.day ?? 1).padStart(2, "0")}` : null;

  const characters: CharacterEntry[] = (m.characters?.edges ?? []).map((e: any) => ({
    name: e.node?.name?.full ?? "Unknown",
    role: e.role === "MAIN" ? "Main" : "Supporting",
    image: e.node?.image?.medium ?? null,
    voiceActors: (e.voiceActors ?? [])
      .slice(0, 1)
      .map((v: any) => ({ name: v.name?.full ?? "Unknown", language: "Japanese" })),
  }));

  const streaming: StreamingLink[] = (m.externalLinks ?? [])
    .filter((l: any) => l.type === "STREAMING")
    .map((l: any) => ({ platform: l.site, url: l.url }));

  const relations: RelationEntry[] = (m.relations?.edges ?? []).map((e: any) => ({
    animeId: e.node?.type === "ANIME" ? e.node.id : null,
    title: e.node?.title?.english ?? e.node?.title?.romaji ?? "Unknown",
    type: e.relationType ?? "RELATED",
    entryType: e.node?.format ?? null,
  }));

  // AniList descriptions contain HTML-ish markup (<br>, <i>) and spoiler
  // markup (~! !~) — strip tags to plain text for our clean layout.
  const cleanSynopsis = (s: string | null | undefined): string | null =>
    s
      ? s
          .replace(/~![\s\S]*?!~/g, "[spoiler]")
          .replace(/<\s*br\s*\/?\s*>/gi, "\n")
          .replace(/<[^>]+>/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim()
      : null;

  const detail: AnimeDetail = {
    ...toSummary(m),
    titleSynonyms: m.synonyms ?? [],
    synopsis: cleanSynopsis(m.description),
    episodeDuration: m.duration ? `~${m.duration} min` : null,
    airedFrom: dateOrNull(m.startDate),
    airedTo: dateOrNull(m.endDate),
    season: m.season ? `${m.season} ${m.seasonYear ?? ""}`.trim() : null,
    nextEpisodeAt: m.nextAiringEpisode?.airingAt ? m.nextAiringEpisode.airingAt * 1000 : null,
    themes: (m.tags ?? []).filter((t: any) => t.rank >= 60).map((t: any) => t.name),
    demographics: [],
    studios: (m.studios?.nodes ?? []).map((s: any) => s.name),
    source: m.source ? m.source.replaceAll("_", " ") : null,
    streaming,
    characters,
    relations,
    tasteTags: getTasteTags(id),
  };

  const isAiring = detail.status === "airing";
  cacheSet(key, detail, isAiring ? TTL.airing : TTL.anime);
  return detail;
}
