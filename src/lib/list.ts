"use client";

// MAL-style list tracking, stored entirely in localStorage — no account,
// no backend. Data shape is versioned so we can migrate later (e.g. to
// real accounts) without losing anyone's list.

import type { AnimeSummary } from "./types";

export type ListStatus = "watching" | "completed" | "plan" | "paused" | "dropped";

export const LIST_STATUSES: { key: ListStatus; label: string }[] = [
  { key: "watching", label: "Watching" },
  { key: "completed", label: "Completed" },
  { key: "plan", label: "Plan to Watch" },
  { key: "paused", label: "Paused" },
  { key: "dropped", label: "Dropped" },
];

export interface ListEntry {
  id: number;
  title: string;
  image: string | null;
  episodes: number | null;
  status: ListStatus;
  progress: number;
  score: number | null; // personal rating 1-10
  updatedAt: number;
}

const STORAGE_KEY = "animeintel:list:v1";

// Legacy entries (written before scoring existed) have no `score` field.
function upgrade(entry: ListEntry): ListEntry {
  return entry.score === undefined ? { ...entry, score: null } : entry;
}

function readAll(): Record<number, ListEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<number, ListEntry>) : {};
    for (const k of Object.keys(map)) map[Number(k)] = upgrade(map[Number(k)]);
    return map;
  } catch {
    return {};
  }
}

function writeAll(map: Record<number, ListEntry>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("animeintel:list-changed"));
}

export function getList(): ListEntry[] {
  return Object.values(readAll()).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getEntry(id: number): ListEntry | null {
  return readAll()[id] ?? null;
}

export function setStatus(anime: AnimeSummary, status: ListStatus): ListEntry {
  const map = readAll();
  const prev = map[anime.id];
  const total = anime.episodes ?? prev?.episodes ?? null;
  const entry: ListEntry = {
    id: anime.id,
    title: anime.title,
    image: anime.image ?? prev?.image ?? null,
    episodes: total,
    status,
    // Completing a show snaps progress to the full episode count
    progress:
      status === "completed" && total != null
        ? total
        : Math.min(prev?.progress ?? 0, total ?? Infinity),
    score: prev?.score ?? null,
    updatedAt: Date.now(),
  };
  map[anime.id] = entry;
  writeAll(map);
  return entry;
}

export function setProgress(id: number, progress: number): ListEntry | null {
  const map = readAll();
  const prev = map[id];
  if (!prev) return null;
  const total = prev.episodes;
  const clamped = Math.max(0, total != null ? Math.min(progress, total) : progress);
  const entry: ListEntry = {
    ...prev,
    progress: clamped,
    // Hitting the final episode marks it completed, MAL-style
    status: total != null && clamped >= total ? "completed" : prev.status,
    updatedAt: Date.now(),
  };
  map[id] = entry;
  writeAll(map);
  return entry;
}

export function removeEntry(id: number) {
  const map = readAll();
  delete map[id];
  writeAll(map);
}

export function setScore(id: number, score: number | null): ListEntry | null {
  const map = readAll();
  const prev = map[id];
  if (!prev) return null;
  const entry: ListEntry = { ...prev, score, updatedAt: Date.now() };
  map[id] = entry;
  writeAll(map);
  return entry;
}
