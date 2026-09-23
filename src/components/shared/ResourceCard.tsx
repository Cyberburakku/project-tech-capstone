import { ExternalLink, Phone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MatchedResource } from "@/types";

export function ResourceCard({ match, rank }: { match: MatchedResource; rank?: number }) {
  const { resource, reason } = match;
  return (
    <article
      aria-labelledby={`res-${resource.id}`}
      className="flex h-full flex-col rounded-3xl border border-line bg-card p-6 shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {rank && (
            <Badge variant={rank === 1 ? "action" : "default"} className="mb-2">
              {rank === 1 ? "Top match" : `Match #${rank}`}
            </Badge>
          )}
          <h3 id={`res-${resource.id}`} className="text-xl font-bold text-ink">
            {resource.name}
          </h3>
        </div>
        {resource.audience && <Badge variant="achievement">For {resource.audience}</Badge>}
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-primary-dark">
        <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0" />
        {reason}
      </p>
      <p className="mt-3 text-ink">{resource.shortDescription}</p>
      <ul className="mt-3 space-y-1 text-sm text-ink-soft">
        {resource.whatTheyHelpWith.slice(0, 3).map((w) => (
          <li key={w}>• {w}</li>
        ))}
      </ul>
      <div className="mt-4 rounded-2xl bg-achievement-soft p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-achievement-dark">Your first step</p>
        <p className="mt-1 text-sm text-ink">{resource.firstStep}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        {resource.phone && resource.phoneHref && (
          <a
            href={resource.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary-strong px-4 text-sm font-semibold text-white hover:bg-[#11564f]"
            aria-label={`Call ${resource.name} at ${resource.phone}`}
          >
            <Phone aria-hidden className="size-4" /> {resource.phone}
          </a>
        )}
        <a
          href={resource.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border-2 border-line px-4 text-sm font-semibold text-ink hover:border-primary hover:bg-primary-soft"
        >
          Visit website <ExternalLink aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
