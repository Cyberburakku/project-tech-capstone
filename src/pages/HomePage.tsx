import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Flame, Lock, Quote, Target } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CoachMessage } from "@/components/shared/SecondTake";
import { RadialScore } from "@/components/shared/RadialScore";
import { AskSecondTake } from "@/components/shared/AskSecondTake";
import { HeroScene } from "@/components/home/HeroScene";
import { ThoughtCard } from "@/components/home/ThoughtCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CoachCard } from "@/components/home/CoachCard";
import { RoughDay } from "@/components/home/RoughDay";
import { HomeFooter } from "@/components/home/HomeFooter";
import { isAiCoachEnabled } from "@/lib/supabase";
import { CATEGORY_META } from "@/data/assessment";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { getStoryOfTheDay } from "@/data/mentors";
import { buildPath, currentLesson, learningStreak, overallProgress } from "@/lib/progress";
import { greeting, homeMessage } from "@/lib/coach";
import { cn } from "@/lib/utils";
import { AvatarArt } from "@/components/shared/avatars";
import { useShell } from "@/components/layout/ShellContext";

export default function HomePage() {
  const profile = useAppStore((s) => s.profile);
  return profile ? <Dashboard /> : <Welcome />;
}

function Rule() {
  return <div role="presentation" className="mx-6 my-10 h-px bg-line web:mx-0 web:my-16" />;
}

function PrivacyNote() {
  return (
    <>
      <Link
        to="/privacy"
        className="inline-flex min-h-11 items-center text-base font-bold text-sage underline decoration-[color-mix(in_srgb,var(--color-sage)_35%,transparent)] decoration-2 underline-offset-[5px] hover:decoration-sage"
      >
        How we protect your privacy
      </Link>
      <p className="mt-0.5 flex items-start gap-2.5 text-[15px] leading-snug text-ink-3">
        <Clock aria-hidden="true" className="mt-0.5 size-[18px] shrink-0" />
        About 3 minutes. Free. No account or password.
      </p>
    </>
  );
}

/**
 * Landing for new visitors.
 * Phone: full-bleed painting under a transparent header, copy in the sky,
 * CTA on the path just above the tab bar. Web (≥900px): split hero.
 */
function Welcome() {
  return (
    <>
      <section
        aria-labelledby="hero-h"
        className={cn(
          // phone: painting fills the hero, header overlays it (−64px)
          "relative -mt-16 h-[max(calc(min(100vw,430px)*1.7539),660px)]",
          // web: two columns, painting in a large rounded frame on the right
          "web:mx-auto web:mt-0 web:grid web:h-auto web:max-w-[72rem] web:grid-cols-[1fr_1.05fr] web:grid-rows-[1fr_auto_1fr] web:gap-x-16 web:px-10 web:pt-8",
        )}
      >
        <div className="absolute inset-0 web:relative web:col-start-2 web:row-span-3 web:row-start-1 web:aspect-[4/5] web:max-h-[calc(100dvh-120px)] web:min-h-[520px] web:w-full web:overflow-hidden web:rounded-3xl web:shadow-lift">
          <HeroScene />
          {/* soft landing into the page */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px z-[1] h-[13%] bg-[linear-gradient(to_bottom,transparent,var(--color-paper))] web:hidden"
          />
        </div>

        <div className="relative z-[2] px-6 pt-[82px] web:col-start-1 web:row-start-1 web:self-end web:px-0 web:pt-0">
          <p className="text-[15px] font-bold tracking-[0.01em] text-sage">For people coming home in Maine</p>
          <h1 id="hero-h" className="mt-1.5 text-[41px] leading-[1.04] text-ink max-[374px]:text-[37px] web:text-[68px] web:leading-[1.02]">
            Your next chapter
            <br />
            <em className="serif-italic text-clay">starts here.</em>
          </h1>
          <p className="mt-3 max-w-[30ch] text-[17px] leading-normal text-ink-2 web:mt-5 web:text-xl">
            Get ready for life after release with <strong className="text-ink">Second&nbsp;Take</strong>, your reentry
            coach.
          </p>
        </div>

        {/* CTA: on the painted path, always above the tab bar (never below the fold on short phones) */}
        <div className="absolute inset-x-6 z-[2] top-[clamp(300px,calc(100svh-150px-env(safe-area-inset-bottom)),calc(100%-68px))] web:static web:col-start-1 web:row-start-2 web:mt-8">
          <Link to="/start" className={cn(buttonVariants({ size: "cta" }), "w-full web:w-auto web:px-10")}>
            Get started <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="hidden web:col-start-1 web:row-start-3 web:mt-4 web:block web:self-start">
          <PrivacyNote />
        </div>
      </section>

      <div className="px-6 pt-3.5 web:hidden">
        <PrivacyNote />
      </div>

      <div className="web:mx-auto web:max-w-[72rem] web:px-10">
        <Rule />
        <section aria-labelledby="thought-h" className="px-6 web:px-0">
          <ThoughtCard />
        </section>
        <Rule />
        <div className="px-6 web:px-0">
          <HowItWorks />
        </div>
        <Rule />
        <div className="px-6 web:grid web:grid-cols-2 web:items-stretch web:gap-10 web:px-0">
          <CoachCard />
          <div className="web:hidden">
            <Rule />
          </div>
          <div className="web:pt-[84px]">
            <RoughDay />
          </div>
        </div>
        <HomeFooter />
      </div>
    </>
  );
}

function Dashboard() {
  const { avatarId, openSheet } = useShell();
  const profile = useAppStore((s) => s.profile)!;
  const latest = useAppStore(selectLatestAssessment);
  const completed = useAppStore((s) => s.completedLessons);
  const path = useMemo(() => buildPath(latest, completed), [latest, completed]);
  const mission = currentLesson(path);
  const progress = overallProgress(completed);
  const streak = learningStreak(completed);
  const story = getStoryOfTheDay();

  return (
    <div className="container-app space-y-6 pt-6 web:pt-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => openSheet("settings")}
          aria-label="Change your avatar"
          className="shrink-0 rounded-full"
        >
          <AvatarArt id={avatarId} className="size-14 web:size-16" />
        </button>
        <div className="min-w-0">
        <h1 className="text-[34px] leading-[1.08] text-ink web:text-5xl">
          {greeting(profile.firstName)}
        </h1>
        <p className="mt-1 text-ink-soft">{profile.county === "Outside Maine" || profile.county === "Not sure yet" ? "Maine" : `${profile.county} County, Maine`}</p>
        </div>
      </div>

      <CoachMessage>
        {homeMessage({
          firstName: profile.firstName,
          lessonsDone: progress.done,
          totalLessons: progress.total,
          streak,
          latest,
        })}
      </CoachMessage>

      <section aria-labelledby="thought-h">
        <ThoughtCard />
      </section>

      {!latest ? (
        <Card className="border-primary/40">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="mb-2">Step 1</Badge>
              <h2 className="text-xl font-bold text-ink">Take your Readiness Check-in</h2>
              <p className="text-ink-soft">10 quick questions · about 3 minutes</p>
            </div>
            <Button asChild size="lg">
              <Link to="/assessment">
                Start check-in <ArrowRight aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {mission ? (
            <Card className="relative overflow-hidden border-action/40">
              <div className="absolute -right-10 -top-10 size-40 rounded-full bg-action-soft" aria-hidden />
              <CardContent className="relative p-6">
                <Badge variant="action" className="mb-3">
                  <Target aria-hidden /> Today's Mission
                </Badge>
                <h2 className="text-2xl font-extrabold text-ink">{mission.lesson.missionTitle}</h2>
                <p className="mt-1 text-ink-soft">
                  {mission.module.title} · Lesson {mission.lesson.order}: {mission.lesson.title}
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Clock aria-hidden className="size-4" /> Estimated time: {mission.lesson.minutes} minutes
                </p>
                <Button asChild size="lg" className="mt-5 w-full sm:w-auto">
                  <Link to={`/lesson/${mission.lesson.id}`}>
                    Start mission <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-achievement">
              <CardContent className="p-6">
                <Badge variant="achievement" className="mb-3">All missions complete</Badge>
                <h2 className="text-2xl font-extrabold text-ink">You finished every lesson!</h2>
                <p className="mt-1 text-ink-soft">Retake your check-in to see how much you've grown.</p>
                <Button asChild size="lg" className="mt-5">
                  <Link to="/assessment">Retake check-in</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="flex items-center gap-5 p-6">
              <RadialScore value={latest.overall} size={120} stroke={12} label="Overall readiness" sublabel="Readiness" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Lessons</p>
                  <Progress value={progress.percent} aria-label={`${progress.done} of ${progress.total} lessons complete`} className="mt-1" />
                  <p className="mt-1 text-xs text-ink-soft">
                    {progress.done} of {progress.total} complete
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Flame aria-hidden className="size-5 text-action-dark" /> {streak} day streak
                </p>
                <Link to="/results" className="text-sm font-semibold text-primary-dark underline-offset-4 hover:underline">
                  View snapshot
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {latest && (
        <section aria-labelledby="path-preview">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="path-preview" className="text-xl font-bold text-ink">Up next on your path</h2>
            <Link to="/path" className="text-sm font-semibold text-primary-dark hover:underline">See full path</Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {path
              .filter((p) => p.status !== "completed")
              .slice(0, 3)
              .map((p) => (
                <li key={p.lesson.id}>
                  <Card className={p.status === "locked" ? "bg-muted/60" : "border-primary"}>
                    <CardContent className="flex items-center gap-3 p-4">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${p.status === "current" ? "bg-primary-strong text-white" : "bg-muted text-ink-soft"}`}>
                        {p.status === "locked" ? <Lock aria-hidden className="size-4" /> : <Target aria-hidden className="size-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{p.lesson.title}</p>
                        <p className="text-xs text-ink-soft">{p.status === "locked" ? "Locked" : "Ready now"} · {p.lesson.minutes} min</p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
          </ol>
        </section>
      )}

      {isAiCoachEnabled && (
        <AskSecondTake
          context={{
            topOpportunity: latest ? CATEGORY_META[latest.topOpportunity].longLabel : undefined,
            currentLesson: mission?.lesson.title,
          }}
        />
      )}

      <section aria-labelledby="story-heading">
        <Card className="bg-card">
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Story of the day</p>
            <h2 id="story-heading" className="mt-1 text-xl font-bold text-ink">{story.headline}</h2>
            <blockquote className="mt-3 flex gap-2 text-ink">
              <Quote aria-hidden className="size-5 shrink-0 text-action-dark" />
              <p className="italic">{story.quote}</p>
            </blockquote>
            <p className="mt-2 text-sm font-semibold text-ink-soft">
              — {story.name}, {story.hometown}
            </p>
          </CardContent>
        </Card>
      </section>

      <RoughDay />
      <HomeFooter />
    </div>
  );
}
