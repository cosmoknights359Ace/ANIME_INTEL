"use client";

import { Swords } from "lucide-react";

export default function BladeFxButton() {
  function trigger() {
    window.dispatchEvent(new CustomEvent("animeintel:play-slash"));
  }

  return (
    <button
      onClick={trigger}
      title="Play Katana Slash FX"
      aria-label="Play blade slash animation"
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-400 border border-white/5 transition-all hover:border-lime-400/40 hover:text-lime-300 hover:bg-white/[0.08]"
    >
      <Swords className="h-3 w-3 text-lime-400" />
      <span>Blade & Quote</span>
    </button>
  );
}
