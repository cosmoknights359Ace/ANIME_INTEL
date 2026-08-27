# AnimeIntel — Project Context & Progress Log

_This file is the persistent memory for this project. Read this at the start of
any session to instantly recall where we are. Update it as we ship features._

## What it is
AnimeIntel = an "Anime Intelligence / Discovery Platform" — search any anime and
get rating, episodes, release dates, airing status, season/zones watch order,
manga source, manga chapters/volumes, genres, characters, voice actors, studio,
directors, episode duration, streaming availability, related anime, popularity/rankings.

## Dev environment (important)
- **Local dev server**: `npm run dev` on **port 12000** (was being run with Next
  on 3000; now 12000). Verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:12000/`.
- Browser check is the reliable way to verify client-rendered visuals (loader/animations),
  but **the current chat model is text-only — it cannot view screenshots.** Confirm
  visual changes via the user's feedback.
- Force the intro loader in the browser with **`?slice=1`** on the URL.

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
- `src/components/SliceIntro.tsx` + CSS in `globals.css` — the katana slice intro loader (see below).
- `src/components/ListButton.tsx` (`+ ProgressControl`), `AnimeCard.tsx`, `Carousel.tsx`, `Timeline.tsx`, `SearchBar.tsx`, `NextEpisode.tsx`.
- Pages: `/` (hero+search, top rated, airing this season), `/anime/[id]`, `/mylist`, `/discover`, `/genre/[genre]`.

## SliceIntro loader — CURRENT STATE (built up over many iterations)
The intro movie: **dark canvas → slow diagonal katana slash → "ANIME INTEL" typed out
with brush font → beat → site fades in.**
- `TIMING` in `SliceIntro.tsx`: `intro { swe:1.5s, ashDelay:1.7s, ashDur:0.4s, fadeDelay:3.2s, fadeDur:0.5s }`, `quick { swe:0.22,... }`.
- Sequence: diagonal slash (~1.5s, lower-left→upper-right, ~-50°), then "Anime Intel"
  wordmark types in, then the overlay fades at ~3.2s.
- **Wordmark**: thin Japanese brush-style font **Zen Kurenaido** (loaded in `layout.tsx`
  as `--font-paper`, `next/font/google`). Revealed with a **typewriter effect** —
  `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` on a **fixed-width centered box**
  with `steps()`, so it types in place without shifting. Warm paper color `#f3d0b0`
  with soft orange-ink glow + blinking caret (`.slice-wordmark::after`).
- **Slash/pathway**: `.slice-pathway` (a bright orange-white diagonal line rotated ~-50°)
  and `.slice-katana` (SVG blade) sweep together corner-to-corner.
- **Burn (was an orange explosion)**: now a **subtle darkening** with gentle drifting embers
  (`.slice-ember`) — no bright radial burst (`.sliceBurst` was removed).
- Background: `radial-gradient(circle at 80% 20%, #1A0D08, #000000)` (spec).
- `SEEN_KEY = "animeintel:slice-seen"` in sessionStorage — first visit full intro,
  returning visits quick slice. `?slice=1` forces full. 4s safety net + Skip button.

## Status / shipping source of truth
- Git history is the source of truth for what's shipped. Confirm against `git log`.
- PR #1 (AnimeIntel platform) **MERGED** into `main` and is live.
- List tracking, score (1–10), "Airing this season", next-episode countdown, and genre pages shipped (**Tier 1**).
- SliceIntro loader is **iterating nicely** — user just said "the loading screen looks better" ✅.

## On-going / open threads
- **PR #2** (branch `vercel/install-vercel-web-analytics-9un0dr` → `anime-intel-app`,
  "Install Vercel Web Analytics") still **open** — unaddressed.
- Possible next loader idea (not requested): add a katakana subtitle アニメ・インテル under the wordmark.
- User may want loader timing or font further tuned after seeing it live on Vercel.

## Agent rules / quirks (don't waste time re-learning)
- `AGENTS.md` at repo root is **auto-rewritten by `next dev`** — do not fight it; treat it as generated.
- Client components must be `"use client"` (Next App Router).
- AniList returns multiple links with the same platform name (e.g., 3× YouTube) — dedupe keys by platform+index.
- This app uses `?slice=1` to force the intro loader for demos.
- **The chat model cannot view images** — rely on user verbal feedback for visual tweaks.

## Git identity
Co-author commits as `openhands <openhands@all-hands.dev>` alongside the user.