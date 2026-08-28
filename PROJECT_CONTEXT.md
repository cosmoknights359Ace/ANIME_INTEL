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

## SliceIntro loader — CURRENT STATE (iterations complete)
The intro: **slash draws diagonally → screen splits into two parts that slide
apart → "ANIME INTEL" types out (brush font) with a katakana ghost subtitle
(アニメ・インテル) → site fades in.** No WebGL/3D — pure CSS, works everywhere.
- `TIMING` in `SliceIntro.tsx`: `intro { swe:1.4s, splitDelay:1.55s, splitDur:0.85s, fadeDelay:3.5s }`, `quick {...}` shortened.
- Wordmark: **Zen Kurenaido** brush font (`--font-paper` in layout, next/font/google),
  revealed with `clip-path` steps so it types in place. Katakana ghost `.slice-kana`
  fades in at split-delay.
- Split halves: `.slice-half--top/--bottom` (each 50% height, dark radial gradient)
  stacked above the wordmark; slide up/down respectively, parted along the slash.
- Slash: `.slice-pathway` neon line, rotate(-50deg), scaleX 0→1 over `--swe`.
- `SEEN_KEY` sessionStorage quick-variant, `?slice=1` forces full, reduced-motion bypass.

(The 3D katana attempt (three.js/KatanaScene) was **removed** — see commit history.)

## Recent feature work
- **SearchBar**: `/` shortcut focuses; recent searches (local `ai:recent-searches`);
  Enter jumps to top result.
- **AnimeStickyHeader** on `/anime/[id]`: fixed bar with poster/rating/ListButton
  once scrolled past the hero.
- **SideNav**: left-edge 3-bar button → slide-in drawer with Home/Discover/MyList
  + genre quick-links. Mounted in layout.

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