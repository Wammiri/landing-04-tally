"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The page load entrance. Children are passed in from the server component,
 * so all copy is still server rendered at first paint: this wrapper only
 * animates the elements it receives. SPEC.md section 5, one of the two
 * animations on the page.
 */
export default function Entrance({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // The `entrance` class is neutralized by a prefers-reduced-motion media
  // query in globals.css. useReducedMotion returns null on the server and on
  // the first client render, so without that CSS the hidden initial style
  // (opacity 0, translateY 14px) would paint before hydration corrects it.
  return (
    <motion.div
      className={`entrance ${className ?? ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
