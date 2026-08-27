# AnimeIntel — Project Context & Progress Log

_This file is the persistent memory for this project. Read this at the start of
any session to instantly recall where we are. Update it as we ship features._

## What it is
AnimeIntel = an "Anime Intelligence / Discovery Platform" — search any anime and
get rating, episodes, release dates, airing status, season/zones watch order,
manga source, manga chapters/volumes, genres, characters, voice actors, studio,
directors, episode duration, streaming availability, related anime, popularity/rankings.

## Tech stack
- **Next.js (App Router)** + React + Tailwind v4 (CSS-first). Black bg + neon lime (#a3e635) / orange (#f97316) brand.
- **AniList GraphQL** — keyless public API. Client helpers in `src/lib/anilist.ts`.
- **localStorage / sessionStorage** for persistence — no backend, no accounts.
- Hosted on **Vercel** (free tier) → **live at https://animeintel.vercel.app**
- Vercel **auto-deploys from `main`**. To ship: branch → PR → merge to `main`. (Vercel token was revoked for safety; manual `vercel --prod` needs a new one.)

## Key files
- `src/lib/anilist.ts` — `searchAnime`, `getAnimeDetail`, `getTopAnime`, `getSeasonAnime`, `getGenreAnime`, `discoverAnime`.
- `src/lib/cache.ts` — in-memory TTL cache (`al-search:`, `al-anime:`, `al-top:`, `al-season:`, `al-genre:` keys).
- `src/lib/list.ts` — MAL-style list tracking: `ListEntry` with status (`watching/completed/plan/paused/dropped`), `progress`, `score` (1–10, null if unset), `updatedAt`. Functions: `removeEntry`, `setProgress`, `setScore`, `upgrade`, `readAll`, `writeAll`, `LIST_STATUSES`.
- `src/lib/useList.ts` — `useListEntry` hook (browser passthrough for Next SSR).
- `src/lib/types.ts` — `AnimeSummary`, `AnimeDetail` (incl. `nextAiringEpisode`/`nextEpisodeAt`, `themes`, `source`, `season`).
- `src/components/SliceIntro.tsx` + CSS in `globals.css` — the katana slice intro loader.
- `src/components/ListButton.tsx` (`+ ProgressControl`), `AnimeCard.tsx`, `Carousel.tsx`, `Timeline.tsx`, `SearchBar.tsx`, `NextEpisode.tsx`.
- Pages: `/` (hero+search, top rated, airing this season), `/anime/[id]`, `/mylist`, `/discover`, `/genre/[genre]`.

## Status / shipping source of truth
- Git history is the source of truth for what's shipped. Confirm against `git log`.
- PR #1 (AnimeIntel platform) **MERGED** into `main` and is live.
- List tracking, score (1–10), "Airing this season", next-episode countdown, and genre pages were the shipped **Tier 1** set.

## On-going / open threads
- SliceIntro loader refinements are in progress (timing + behavior changes pending).
- A browser-check is the reliable way to verify client-rendered visuals (loader, animations).

## Agent rules / quirks (don't waste time re-learning)
- `AGENTS.md` at repo root is **auto-rewritten by `next dev`** — do not fight it; treat it as generated.
- Client components must be `"use client"` (Next App Router).
- AniList returns multiple links with the same platform name (e.g., 3× YouTube) — dedupe keys by platform+index.
- This app uses `?slice=1` to force the intro loader for demos.

## Git identity
Co-author commits as `openhands <openhands@all-hands.dev>` alongside the user.