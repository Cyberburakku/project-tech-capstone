import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, LifeBuoy, Sprout, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiRing } from "@/components/shared/RadialScore";
import { CoachMessage } from "@/components/shared/SecondTake";
import { Celebration } from "@/components/shared/Celebration";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { CATEGORY_META, CATEGORY_ORDER } from "@/data/assessment";
import { buildPath, currentLesson } from "@/lib/progress";
import { scoreBand } from "@/lib/scoring";
import { resultsMessage } from "@/lib/coach";

export default function ResultsPage() {
  const location = useLocation();
  const fresh = Boolean((location.state as { fresh?: boolean } | null)?.fresh);
  const profile = useAppStore((s) => s.profile)!;
  const result = useAppStore(selectLatestAssessment)!;
  const completed = useAppStore((s) => s.completedLessons);
  const mission = useMemo(() => currentLesson(buildPath(result, completed)), [result, completed]);

  const strength = CATEGORY_META[result.topStrength];
  const opportunity = CATEGORY_META[result.topOpportunity];
  const band = scoreBand(result.overall);

  return (
    <div className="container-app">
      {fresh && <Celebration pieces={40} />}
      <PageHeader
        eyebrow="Your results"
        title="Your Readiness Snapshot"
        description="This is a starting point, not a grade. Every score can grow — and your path is built to help it grow."
      />

      <CoachMessage className="mb-6">{resultsMessage(profile.firstName, result)}</CoachMessage>

      <Card>
        <CardContent className="grid items-center gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <MultiRing
                size={240}
                label={`Overall readiness ${result.overall} out of 100.`}
                scores={CATEGORY_ORDER.map((k) => ({
                  key: k,
                  label: CATEGORY_META[k].label,
                  value: result.scores[k],
                  color: CATEGORY_META[k].hex,
                }))}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
                <span className="text-4xl font-extrabold text-ink">{result.overall}</span>
                <span className="text-xs font-semibold text-ink-soft">Overall</span>
              </div>
            </div>
            <Badge variant="achievement">
              Overall readiness: {result.overall}/100 · {band.label}
            </Badge>
          </div>

          <ul className="space-y-4" aria-label="Scores by category">
            {CATEGORY_ORDER.map((k, i) => {
              const meta = CATEGORY_META[k];
              const value = result.scores[k];
              return (
                <li key={k}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <span className="size-3 rounded-full" style={{ background: meta.hex }} aria-hidden />
                      {meta.label}
                    </span>
                    <span className="text-sm font-bold text-ink">
                      {value}
                      <span className="font-medium text-ink-soft"> · {scoreBand(value).label}</span>
                    </span>
                  </div>
                  <div
                    className="h-3 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={meta.longLabel}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: meta.hex }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.08 }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{meta.description}</p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/40">
          <CardContent className="flex items-start gap-4 p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary-dark">
              <Star aria-hidden className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Top Strength</p>
              <h2 className="text-xl font-bold text-ink">{strength.longLabel}</h2>
              <p className="text-sm text-ink-soft">{scoreBand(result.scores[result.topStrength]).message}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-action/40">
          <CardContent className="flex items-start gap-4 p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-action-soft text-action-dark">
              <Sprout aria-hidden className="size-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-action-dark">Top Opportunity</p>
              <h2 className="text-xl font-bold text-ink">{opportunity.longLabel}</h2>
              <p className="text-sm text-ink-soft">This is where a little work will make the biggest difference.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {mission && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative mt-6 overflow-hidden border-2 border-action">
            <div className="absolute -right-16 -top-16 size-48 rounded-full bg-action-soft" aria-hidden />
            <CardContent className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <Badge variant="action" className="mb-2">
                  <Target aria-hidden /> Today's Mission
                </Badge>
                <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">{mission.lesson.missionTitle}</h2>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-ink">
                  <Clock aria-hidden className="size-4" /> Estimated Time: {mission.lesson.minutes} minutes
                </p>
                <p className="mt-1 text-sm text-ink-soft">Just one mission. That's all for today.</p>
              </div>
              <Button asChild size="lg">
                <Link to={`/lesson/${mission.lesson.id}`}>
                  Start my mission <ArrowRight aria-hidden />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="secondary">
          <Link to="/resources">
            <LifeBuoy aria-hidden /> See my top 3 resources
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/path">View my learning path</Link>
        </Button>
      </div>
    </div>
  );
}
