"use client";

import { useEffect, useState } from "react";

const SEEN_KEY = "animeintel:slice-seen";

// The slice intro. First visit: full katana sweep + the site splitting into
// two halves. Returning visits (same tab): a ~600ms quick slice.
const TIMING = {
  intro: { swe: 0.5, slideDelay: 0.32, slideDur: 0.6, fadeDelay: 2.0, fadeDur: 0.6 },
  quick: { swe: 0.28, slideDelay: 0.16, slideDur: 0.26, fadeDelay: 0.55, fadeDur: 0.3 },
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
    "--slide-delay": `${t.slideDelay}s`,
    "--slide-dur": `${t.slideDur}s`,
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
      {/* the page, split into two halves */}
      <div className="slice-half slice-half-top" aria-hidden />
      <div className="slice-half slice-half-bottom" aria-hidden />

      {/* the neon pathway the blade carves */}
      <div className="slice-pathway" aria-hidden />

      {/* the katana */}
      <div className="slice-katana" aria-hidden>
        <svg viewBox="0 0 360 60" className="w-72 sm:w-80">
          <defs>
            <linearGradient id="sliceBlade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cfe0ff" />
              <stop offset="70%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eaf2ff" />
            </linearGradient>
          </defs>
          <g stroke="none">
            {/* handle */}
            <rect x="12" y="34" width="76" height="16" rx="6" fill="#161616" />
            <path d="M24 36 v12 M36 36 v12 M48 36 v12 M60 36 v12 M72 36 v12" stroke="#3a3a3a" strokeWidth="2" />
            <rect x="8" y="32" width="9" height="20" rx="2" fill="#0c0c0c" />
            {/* guard */}
            <rect x="90" y="22" width="9" height="32" rx="2" fill="#111" stroke="#d4af37" strokeWidth="1" />
            {/* blade */}
            <path d="M100 42 L352 42 L352 41 L104 39 Z" fill="url(#sliceBlade)" />
            <path d="M306 44 L352 42 L302 40 Z" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <button className="slice-skip" onClick={() => setGone(true)}>
        Skip
      </button>
    </div>
  );
}