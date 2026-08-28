"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// 3D katana (client-only, three.js needs the browser). Replaces the old SVG blade.
const KatanaScene = dynamic(() => import("./KatanaScene"), { ssr: false });

const SEEN_KEY = "animeintel:slice-seen";

// The slice intro. First visit: full katana sweep + the site burning away
// into ashes. Returning visits (same tab): a ~600ms quick slice.
const TIMING = {
  // The slash (swe) is long and cinematic. The wordmark is typed in after
  // it lands, then a beat, then the site fades in.
  intro: { swe: 1.5, ashDelay: 1.7, ashDur: 0.4, fadeDelay: 3.2, fadeDur: 0.5 },
  quick: { swe: 0.22, ashDelay: 0.3, ashDur: 0.3, fadeDelay: 0.65, fadeDur: 0.25 },
};

// Floating embers that drift up as the screen burns to ashes.
const EMBERS = Array.from({ length: 28 }, (_, i) => {
  const x = `${(i * 37 + 7) % 100}%`; // spread across the width
  const y0 = `${12 + ((i * 53) % 72)}%`; // start height (burning region)
  const drift = `${((i % 5) - 2) * 46}px`; // slight horizontal drift
  const dur = `${1.0 + ((i * 29) % 70) / 100}s`;
  const delay = `${(i * 7) % 60}ms`;
  const scale = `${0.8 + ((i * 13) % 40) / 100}`;
  return { "--x": x, "--y0": y0, "--drift": drift, "--d": dur, "--delay": delay, "--s": scale } as React.CSSProperties;
});

export default function SliceIntro() {
  const [variant, setVariant] = useState<"intro" | "quick">("intro");
  const [gone, setGone] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Accessibility first: never animate for users who ask for less motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    // ?slice=1 forces the full intro for demo/debug purposes.
    const forced = new URLSearchParams(window.location.search).get("slice") === "1";
    if (!forced && sessionStorage.getItem(SEEN_KEY)) {
      setVariant("quick");
    } else {
      if (!forced) sessionStorage.setItem(SEEN_KEY, "1");
      setVariant("intro");
    }
    // Safety net so the loader can never trap the user on-screen.
    const t = setTimeout(() => setGone(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced) setGone(true);
  }, [reduced]);

  if (gone) return null;

  const t = TIMING[variant];
  const vars = {
    "--swe": `${t.swe}s`,
    "--ash-delay": `${t.ashDelay}s`,
    "--ash-dur": `${t.ashDur}s`,
    "--fade-delay": `${t.fadeDelay}s`,
    "--fade-dur": `${t.fadeDur}s`,
  } as React.CSSProperties;

  return (
    <div
      className="slice-root"
      style={vars}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "sliceFade") setGone(true);
      }}
    >
      {/* the dark screen that burns away into ashes after the slash */}
      <div className="slice-burn" aria-hidden />

      {/* the wordmark, typed in after the slash */}
      <div className="slice-wordmark" aria-hidden>
        Anime Intel
      </div>

      {/* floating embers */}
      {EMBERS.map((style, i) => (
        <span key={i} className="slice-ember" style={style} aria-hidden />
      ))}

      {/* the neon pathway the blade carves — lower-left → upper-right */}
      <div className="slice-pathway" aria-hidden />

      {/* the 3D katana sweeping along the slash */}
      <KatanaScene />

      <button className="slice-skip" onClick={() => setGone(true)}>
        Skip
      </button>
    </div>
  );
}