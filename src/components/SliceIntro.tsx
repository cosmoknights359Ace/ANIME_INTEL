"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "animeintel:slice-seen";

// The slice intro. A diagonal slash draws across the screen, then the dark
// canvas splits into two parts that slide apart, revealing "ANIME INTEL"
// typing out underneath. First visit: full intro. Returning visits (same
// tab): a shortened version.
const TIMING = {
  intro: { swe: 1.4, splitDelay: 1.55, splitDur: 0.85, fadeDelay: 3.5, fadeDur: 0.5 },
  quick: { swe: 0.3, splitDelay: 0.4, splitDur: 0.4, fadeDelay: 1.05, fadeDur: 0.25 },
};

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
    const t = setTimeout(() => setGone(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced) setGone(true);
  }, [reduced]);

  if (gone) return null;

  const t = TIMING[variant];
  const vars = {
    "--swe": `${t.swe}s`,
    "--split-delay": `${t.splitDelay}s`,
    "--split-dur": `${t.splitDur}s`,
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
      {/* the wordmark, typed out as the screen splits apart */}
      <div className="slice-wordmark" aria-hidden>
        Anime Intel
        <span className="slice-kana">アニメ・インテル</span>
      </div>

      {/* the dark screen, in two halves that slide apart along the slash */}
      <div className="slice-half slice-half--top" aria-hidden />
      <div className="slice-half slice-half--bottom" aria-hidden />

      {/* the neon slash line — lower-left → upper-right diagonal */}
      <div className="slice-pathway" aria-hidden />

      <button className="slice-skip" onClick={() => setGone(true)}>
        Skip
      </button>
    </div>
  );
}
