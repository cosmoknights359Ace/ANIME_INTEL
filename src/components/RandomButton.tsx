"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// "Surprise me" button — hits /api/random and jumps to a random anime page.
export default function RandomButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/random");
      const data = await res.json();
      if (data.id) router.push(`/anime/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-200 ring-1 ring-zinc-700 transition hover:ring-lime-400/60 disabled:opacity-60"
    >
      {loading ? "Rolling…" : "🎲 Surprise me"}
    </button>
  );
}
