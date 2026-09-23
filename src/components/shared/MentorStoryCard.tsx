import { Footprints, MapPin, Quote, Sparkles } from "lucide-react";
import type { MentorStory } from "@/types";

const THEME_LABEL: Record<MentorStory["theme"], string> = {
  technology: "Technology",
  employment: "Employment",
  support: "Support network",
  community: "Community",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Z]/gi, "")
    .slice(0, 2);
}

export function MentorStoryCard({ story, compact = false }: { story: MentorStory; compact?: boolean }) {
  return (
    <article aria-labelledby={`${story.id}-title`} className="overflow-hidden rounded-3xl bg-card shadow-soft">
      <header className="bg-gradient-to-br from-primary-soft to-achievement-soft p-6">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary-dark">
          <Footprints aria-hidden className="size-4" /> Someone Who Walked This Path
        </p>
        <div className="mt-4 flex items-center gap-4">
          <span
            aria-hidden
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary-strong text-xl font-extrabold text-white ring-4 ring-card"
          >
            {initials(story.name)}
          </span>
          <div>
            <h2 id={`${story.id}-title`} className="text-xl font-bold leading-snug text-ink">
              {story.headline}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-ink-soft">
              <span className="font-semibold text-ink">
                {story.name}, {story.age}
              </span>
              <span className="flex items-center gap-1">
                <MapPin aria-hidden className="size-3.5" /> {story.hometown}
              </span>
              <span>{THEME_LABEL[story.theme]}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-4 p-6">
        {(compact ? story.story.slice(0, 2) : story.story).map((para, i) => (
          <p key={i} className="text-[17px] leading-relaxed text-ink">
            {para}
          </p>
        ))}

        <blockquote className="flex gap-3 rounded-2xl bg-action-soft p-4">
          <Quote aria-hidden className="size-6 shrink-0 text-action-dark" />
          <p className="text-lg font-semibold italic text-ink">{story.quote}</p>
        </blockquote>

        {!compact && (
          <>
            <div>
              <h3 className="font-bold text-ink">What helped {story.name.split(" ")[0]}</h3>
              <ul className="mt-2 space-y-2">
                {story.whatHelped.map((tip) => (
                  <li key={tip} className="flex gap-2 text-ink">
                    <Sparkles aria-hidden className="mt-1 size-4 shrink-0 text-achievement-dark" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-2xl bg-primary-soft p-4 text-ink">
              <strong>Today: </strong>
              {story.today}
            </p>
          </>
        )}
        <p className="text-xs text-ink-soft">
          Stories are composites inspired by common reentry experiences. Names and details are fictional.
        </p>
      </div>
    </article>
  );
}
