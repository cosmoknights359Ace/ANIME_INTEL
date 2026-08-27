// Phase 3 — mood catalog. Each mood maps to AniList genres/tags.
// Tags were chosen from AniList's actual tag vocabulary.

export interface Mood {
  id: string;
  label: string;
  emoji: string;
  tags: string[]; // AniList genre/tag names (OR-combined)
}

export const MOODS: Mood[] = [
  { id: "adrenaline", label: "Adrenaline", emoji: "⚔️", tags: ["Action", "Gore", "Swordplay", "Military", "Battle Royale"] },
  { id: "feels", label: "Emotional", emoji: "😭", tags: ["Drama", "Tragedy", "Melancholy"] },
  { id: "cozy", label: "Cozy & wholesome", emoji: "☕", tags: ["Slice of Life", "Iyashikei", "CGDCT"] },
  { id: "mind-bending", label: "Mind-bending", emoji: "🌀", tags: ["Psychological", "Mystery", "Time Manipulation", "Surreal Comedy"] },
  { id: "dark", label: "Dark & gritty", emoji: "🌑", tags: ["Thriller", "Horror", "Crime", "Survival"] },
  { id: "laugh", label: "Make me laugh", emoji: "😂", tags: ["Comedy", "Parody", "Satire", "Slapstick"] },
  { id: "romance", label: "Romance", emoji: "💘", tags: ["Romance", "Love Triangle", "Tsundere"] },
  { id: "epic", label: "Epic worlds", emoji: "🐉", tags: ["Fantasy", "Adventure", "Isekai", "Mythology"] },
  { id: "scifi", label: "Sci-fi", emoji: "🚀", tags: ["Sci-Fi", "Mecha", "Cyberpunk", "Space", "Time Manipulation"] },
  { id: "sports", label: "Sports & competition", emoji: "🏆", tags: ["Sports", "Team Sports", "Card Games"] },
];

export interface LengthOption {
  id: string;
  label: string;
  maxEpisodes?: number;
  format?: string;
}

export const LENGTHS: LengthOption[] = [
  { id: "any", label: "Any length" },
  { id: "movie", label: "A movie", format: "MOVIE" },
  { id: "short", label: "One season (≤ 13 ep)", maxEpisodes: 13, format: "TV" },
  { id: "medium", label: "A couple seasons (≤ 26 ep)", maxEpisodes: 26, format: "TV" },
  { id: "long", label: "Long haul", format: "TV" },
];
