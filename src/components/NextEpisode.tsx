"use client";

import { useEffect, useState } from "react";

// Lives on anime pages. Shows "Next ep in 3d 04h" / "Air time reached"
// and re-renders every minute so it stays live without polling AniList.
export default function NextEpisode({ airingAt }: { airingAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const diff = airingAt - now;
  if (diff <= 0) {
    return (
      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
        New episode out
      </span>
    );
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const label =
    days > 0
      ? `Next ep in ${days}d ${hours}h`
      : hours > 0
        ? `Next ep in ${hours}h ${minutes}m`
        : `Next ep in ${minutes}m`;

  return (
    <span className="rounded-full bg-lime-400/15 px-3 py-1 text-xs font-medium text-lime-300 ring-1 ring-lime-400/40">
      {label}
    </span>
  );
}