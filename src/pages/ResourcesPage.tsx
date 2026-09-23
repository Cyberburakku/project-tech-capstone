import { useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { CoachMessage } from "@/components/shared/SecondTake";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { matchResources } from "@/data/resources";
import { cn } from "@/lib/utils";
import type { NeedTag } from "@/types";

const FOCUS_OPTIONS: { tag: NeedTag | "auto"; label: string }[] = [
  { tag: "auto", label: "My check-in" },
  { tag: "housing", label: "Housing" },
  { tag: "employment", label: "Work" },
  { tag: "basic-needs", label: "Food & benefits" },
  { tag: "legal", label: "Legal help" },
  { tag: "recovery", label: "Recovery" },
  { tag: "support", label: "People & community" },
  { tag: "technology", label: "Technology" },
  { tag: "women", label: "Women in reentry" },
];

export default function ResourcesPage() {
  const profile = useAppStore((s) => s.profile)!;
  const latest = useAppStore(selectLatestAssessment)!;
  const [focus, setFocus] = useState<NeedTag | "auto">("auto");

  const matches = useMemo(() => {
    const needTags =
      focus === "auto" ? latest.needTags : [focus, ...latest.needTags.filter((t) => t !== focus)];
    return matchResources({ scores: latest.scores, county: profile.county, needTags });
  }, [focus, latest, profile.county]);

  return (
    <div className="container-app">
      <PageHeader
        eyebrow="Trusted resources"
        title="Your top 3 resources"
        description="No endless lists. Just the three places most likely to help you right now — and exactly what to say when you reach out."
      />

      <CoachMessage className="mb-6">
        You don't have to call all of them. Pick one, and take the first step. That's a win.
      </CoachMessage>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm font-bold text-ink">Match my resources to:</legend>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((o) => (
            <label
              key={o.tag}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 px-4 text-sm font-semibold has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/30",
                focus === o.tag
                  ? "border-primary-strong bg-primary-strong text-white"
                  : "border-line bg-card text-ink hover:border-primary",
              )}
            >
              <input
                type="radio"
                name="focus"
                className="sr-only"
                checked={focus === o.tag}
                onChange={() => setFocus(o.tag)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <ol className="grid gap-5 lg:grid-cols-3" aria-live="polite">
        {matches.map((m, i) => (
          <li key={m.resource.id}>
            <ResourceCard match={m} rank={i + 1} />
          </li>
        ))}
      </ol>

      <Card className="mt-8 border-crisis/40 bg-crisis-soft">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">In crisis or need to talk right now?</h2>
            <p className="text-ink">
              Call or text <strong>988</strong> any time, day or night. For local help with housing, food, and more,
              dial <strong>211</strong>.
            </p>
          </div>
          <a
            href="tel:988"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-crisis-strong px-5 font-bold text-white hover:bg-[#9b1624]"
          >
            <Phone aria-hidden className="size-5" /> Call 988
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
