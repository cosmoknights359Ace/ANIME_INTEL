# Curated Data Layer

This is our differentiator — hand-maintained data that MAL/AniList don't
present well. Merged into API responses by `src/lib/curated.ts`.

## taste-tags/

One file per anime, named by MAL ID: `<mal_id>.json`

```json
{
  "id": 16498,
  "title": "Attack on Titan",
  "tags": ["dark", "political-intrigue", "moral-ambiguity", "fast-paced", "plot-twists"]
}
```

Tags describe *tone, pacing, themes, and tropes* — not genres. These power
the "what should I watch next?" matching in `/discover` (Phase 3).

## watch-orders/ (Phase 2)

One file per franchise, named by a franchise slug: `fate.json`, `monogatari.json`, ...

Each file defines the curated linear watch order (and optional chronological
story order) for franchises where release order is confusing.
