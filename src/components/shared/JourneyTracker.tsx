import { Link } from "react-router-dom";
import { Award, Check, ClipboardCheck, LifeBuoy, Route, Target, type LucideIcon } from "lucide-react";
import type { JourneyKey, JourneyStep } from "@/lib/journey";
import { cn } from "@/lib/utils";

const ICONS: Record<JourneyKey, LucideIcon> = {
  checkin: ClipboardCheck,
  mission: Target,
  path: Route,
  resources: LifeBuoy,
  certificate: Award,
};

/**
 * Check-In → Today's Mission → My Path → Resources → Certificate, as icons on a
 * thick progress bar. Done steps are filled, the next open step is ringed.
 */
export function JourneyTracker({
  steps,
  doneCount,
  current,
  className,
}: {
  steps: JourneyStep[];
  doneCount: number;
  current: JourneyStep | null;
  className?: string;
}) {
  const percent = Math.round((doneCount / steps.length) * 100);
  return (
    <div className={className}>
      <div
        className="relative h-4 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Your journey"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuetext={`${doneCount} of ${steps.length} steps done`}
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-sage),var(--color-sun))] transition-[width] duration-700"
          style={{ width: `${Math.max(percent, 4)}%` }}
        />
      </div>
      <ol className="-mx-3 mt-4 grid grid-cols-5 gap-0.5 sm:mx-0 sm:gap-1">
        {steps.map((s) => {
          const Icon = ICONS[s.key];
          const isCurrent = current?.key === s.key;
          return (
            <li key={s.key} className="min-w-0">
              <Link
                to={s.to}
                className="group flex flex-col items-center gap-1.5 rounded-2xl px-0.5 py-1 text-center"
                aria-label={`${s.label}: ${s.done ? "done" : isCurrent ? "up next" : "not started"}`}
              >
                <span
                  className={cn(
                    "relative grid size-12 place-items-center rounded-full transition-transform group-hover:scale-105 sm:size-14",
                    s.done && "bg-sage text-paper",
                    isCurrent && "bg-clay-soft text-clay-press ring-4 ring-clay dark:text-sun",
                    !s.done && !isCurrent && "bg-muted text-ink-3",
                  )}
                >
                  <Icon aria-hidden className="size-6" />
                  {s.done && (
                    <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full border-2 border-card bg-sun text-on-bright">
                      <Check aria-hidden className="size-3" strokeWidth={3.5} />
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[11.5px] font-bold leading-tight tracking-[-0.01em] sm:text-[13px]",
                    s.done || isCurrent ? "text-ink" : "text-ink-2",
                  )}
                >
                  {s.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
