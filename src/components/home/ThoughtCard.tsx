import { useState } from "react";
import { RotateCw } from "lucide-react";
import { affirmations } from "@/data/affirmations";

/** "A thought for today": one affirmation at a time. Starts on a random one; no marquee. */
export function ThoughtCard() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * affirmations.length));
  return (
    <div className="relative overflow-hidden rounded-3xl bg-sage-soft px-6 pb-5 pt-[26px]">
      <span
        aria-hidden="true"
        className="absolute -right-10 -top-10 size-[150px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-sun)_55%,transparent)_0_34%,color-mix(in_srgb,var(--color-sun)_22%,transparent)_35%_60%,transparent_61%)]"
      />
      <p id="thought-h" className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-2">
        A thought for today
      </p>
      <blockquote
        aria-live="polite"
        className="serif-italic relative min-h-[2.44em] max-w-[15em] text-[25px] leading-[1.22] tracking-[-0.01em] text-ink [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 72, "SOFT" 100' }}
      >
        {affirmations[index]}
      </blockquote>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-ink-2">
          {index + 1} of {affirmations.length}
        </span>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % affirmations.length)}
          className="-mr-2 inline-flex h-11 items-center gap-2 rounded-xl px-3.5 text-[15px] font-bold text-sage hover:bg-card/60"
        >
          <RotateCw aria-hidden="true" className="size-[18px]" />
          Show another
        </button>
      </div>
    </div>
  );
}
