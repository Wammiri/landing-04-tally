"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Index 0 is "story", which is what the server renders. The glyph alternates
// with the word: up and green on story and edge, down and red on pattern
// and cost. SPEC.md section 3.
const WORDS = [
  { word: "story", glyph: "▲", tone: "gain" },
  { word: "pattern", glyph: "▼", tone: "loss" },
  { word: "cost", glyph: "▼", tone: "loss" },
  { word: "edge", glyph: "▲", tone: "gain" },
] as const;

const INTERVAL_MS = 2400;

export default function TickingWord() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Static "story." with the green glyph under reduced motion.
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const current = WORDS[index];
  const toneClass = current.tone === "gain" ? "text-gain" : "text-loss";

  return (
    <>
      {" "}
      <span
        aria-hidden="true"
        data-testid="ticker-glyph"
        data-tone={current.tone}
        className={`inline-block font-mono align-middle text-[0.34em] leading-none ${toneClass} transition-colors duration-300`}
      >
        {current.glyph}
      </span>{" "}
      {/*
        Fixed width reserved to "pattern", the longest word in the set, so the
        line never reflows as words swap (D-10). The width comes from an
        invisible strut rendering "pattern" in the same font at the same size,
        rather than a guessed em value, so the reservation stays exact at every
        step of the clamp() display size. The animated words are laid over the
        strut in the same grid cell.
      */}
      <span
        data-testid="ticker-slot"
        className="relative grid align-baseline [grid-template-areas:'w'] justify-items-start"
        style={{ display: "inline-grid" }}
      >
        {/*
          The strut renders the longest word invisibly so the grid cell is
          exactly as wide as the widest state and the line below never
          reflows (D-10). The visible word and the period are laid over it in
          the same cell, so the period stays tight against the word instead of
          being pushed out to the reserved width.
        */}
        <span
          aria-hidden="true"
          className="invisible [grid-area:w] whitespace-nowrap"
        >
          pattern.
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current.word}
            data-testid="ticker-word"
            className="[grid-area:w] whitespace-nowrap"
            initial={reduceMotion ? false : { y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { y: -8, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {current.word}
            <span aria-hidden="true">.</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
