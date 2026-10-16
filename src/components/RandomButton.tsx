"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shuffle } from "lucide-react";

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
      className="inline-flex items-center gap-2 rounded-xl bg-white/[0.05] px-4 py-2 text-xs font-semibold text-zinc-200 border border-white/10 transition-all hover:bg-white/[0.09] hover:border-lime-400/50 hover:text-lime-300 disabled:opacity-50 active:scale-95"
    >
      <Shuffle className={`h-3.5 w-3.5 ${loading ? "animate-spin text-lime-400" : ""}`} />
      <span>{loading ? "Rolling..." : "Surprise Me"}</span>
    </button>
  );
}
