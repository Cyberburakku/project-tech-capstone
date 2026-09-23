import { useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";
import { affirmations } from "@/data/affirmations";
import { cn } from "@/lib/utils";

/** Global rotating affirmations. Pausable to meet WCAG 2.2.2 (Pause, Stop, Hide). */
export function AffirmationTicker() {
  const [paused, setPaused] = useState(false);
  const items = [...affirmations, ...affirmations];

  return (
    <section
      aria-label="Daily affirmations"
      className="relative flex items-center overflow-hidden border-b border-achievement/40 bg-achievement-soft text-ink"
    >
      <span className="z-10 flex h-10 shrink-0 items-center gap-1.5 bg-achievement px-3 text-xs font-bold uppercase tracking-wide text-ink">
        <Sparkles aria-hidden className="size-4" />
        <span className="hidden sm:inline">Affirmations</span>
      </span>
      <div className="relative flex-1 overflow-hidden" aria-hidden>
        <div
          className={cn(
            "flex w-max animate-ticker gap-10 whitespace-nowrap py-2 pl-6 text-sm font-medium",
            paused && "[animation-play-state:paused]",
          )}
        >
          {items.map((a, i) => (
            <span key={i} className="flex items-center gap-10">
              {a}
              <span className="text-achievement-dark">✦</span>
            </span>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {affirmations.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="z-10 flex size-10 shrink-0 items-center justify-center bg-achievement-soft text-ink hover:bg-achievement/40"
        aria-label={paused ? "Play affirmations" : "Pause affirmations"}
        aria-pressed={paused}
      >
        {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
      </button>
    </section>
  );
}
