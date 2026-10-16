// Normalized data model — the ONLY shapes the frontend ever sees.
// AniList responses are converted into these types in anilist.ts.

export type AnimeStatus = "airing" | "finished" | "upcoming";

export interface AnimeSummary {
  id: number;
  title: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  image: string | null;
  bannerImage: string | null;
  rating: number | null;
  scoredBy: number | null;
  popularityRank: number | null;
  status: AnimeStatus;
  episodes: number | null;
  type: string | null; // TV, Movie, OVA, ...
  year: number | null;
  genres: string[];
  description?: string | null;
}

export interface StreamingLink {
  platform: string;
  url: string;
}

export interface CharacterEntry {
  name: string;
  role: string; // Main / Supporting
  image: string | null;
  voiceActors: { name: string; language: string }[];
}

export interface RelationEntry {
  animeId: number | null;
  title: string;
  type: string; // sequel, prequel, side_story, ...
  entryType: string | null; // TV, Movie, OVA...
}

export interface AnimeDetail extends AnimeSummary {
  titleSynonyms: string[];
  synopsis: string | null;
  episodeDuration: string | null;
  airedFrom: string | null;
  airedTo: string | null;
  season: string | null;
  nextEpisodeAt: number | null; // epoch ms of next airing, null if finished/unknown
  themes: string[];
  demographics: string[];
  studios: string[];
  source: string | null; // Manga, Light novel, Original...
  streaming: StreamingLink[];
  characters: CharacterEntry[];
  relations: RelationEntry[];
  tasteTags: string[]; // OUR curated layer — populated from data/curated
}

export interface SearchResult {
  results: AnimeSummary[];
  query: string;
}

export interface TrendingResult {
  results: AnimeSummary[];
}

// Phase 2 — watch-order timelines
export type WatchRole = "main" | "optional";

export interface WatchOrderStep {
  animeId: number;
  title: string;
  image: string | null;
  type: string | null;
  episodes: number | null;
  year: number | null;
  rating: number | null;
  role: WatchRole;
  note: string | null; // "Start here", "Optional", etc.
  isCurrent: boolean;
}

export interface WatchOrder {
  franchiseName: string;
  curated: boolean;
  steps: WatchOrderStep[];
}
