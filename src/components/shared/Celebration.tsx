import { useMemo } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";

const COLORS = ["#2C6A5C", "#B4472A", "#F2B544", "#83311B", "#DDEBE4"];

/** Lightweight confetti burst. Decorative only; skipped for reduced motion. */
export function Celebration({ pieces = 60 }: { pieces?: number }) {
  const reduce = useReducedMotionConfig();
  const confetti = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 900,
        y: 300 + Math.random() * 500,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.3,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [pieces],
  );
  if (reduce) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex justify-center overflow-hidden" aria-hidden>
      {confetti.map((c) => (
        <motion.span
          key={c.id}
          className="absolute top-1/3"
          style={{
            width: c.size,
            height: c.round ? c.size : c.size * 0.45,
            backgroundColor: c.color,
            borderRadius: c.round ? "999px" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: c.x, y: [0, -220, c.y], opacity: [1, 1, 0], rotate: c.rotate, scale: 1 }}
          transition={{ duration: 2.2, delay: c.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
