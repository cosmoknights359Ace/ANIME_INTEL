"use client";

import { useEffect, useState } from "react";
import { getEntry, getList, type ListEntry } from "./list";

// Re-reads the list on every "animeintel:list-changed" event so all
// components stay in sync without a state library.

export function useList(): ListEntry[] {
  const [entries, setEntries] = useState<ListEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(getList());
    refresh();
    window.addEventListener("animeintel:list-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("animeintel:list-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return entries;
}

export function useListEntry(id: number): ListEntry | null {
  const [entry, setEntry] = useState<ListEntry | null>(null);
  useEffect(() => {
    const refresh = () => setEntry(getEntry(id));
    refresh();
    window.addEventListener("animeintel:list-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("animeintel:list-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [id]);
  return entry;
}
