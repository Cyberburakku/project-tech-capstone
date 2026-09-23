import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Flame,
  HeartHandshake,
  Lock,
  Quote,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CoachMessage } from "@/components/shared/SecondTake";
import { RadialScore } from "@/components/shared/RadialScore";
import { PathIllustration } from "@/components/shared/Illustration";
import { AskSecondTake } from "@/components/shared/AskSecondTake";
import { isAiCoachEnabled } from "@/lib/supabase";
import { CATEGORY_META } from "@/data/assessment";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { randomAffirmation } from "@/data/affirmations";
import { getStoryOfTheDay } from "@/data/mentors";
import { buildPath, currentLesson, learningStreak, overallProgress } from "@/lib/progress";
import { greeting, homeMessage } from "@/lib/coach";

export default function HomePage() {
  const profile = useAppStore((s) => s.profile);
  return profile ? <Dashboard /> : <Welcome />;
}

function AffirmationCard() {
  const affirmation = useMemo(() => randomAffirmation(), []);
  return (
    <Card className="relative overflow-hidden border-achievement/50 bg-achievement-soft">
      <CardContent className="flex items-start gap-3 p-5">
        <Sparkles aria-hidden className="mt-0.5 size-6 shrink-0 text-achievement-dark" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-achievement-dark">Today's affirmation</p>
          <p className="mt-1 text-lg font-semibold text-ink">“{affirmation}”</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Welcome() {
  const features = [
    { icon: Target, title: "Know where you stand", text: "A 10-question check-in shows your strengths and next steps." },
    { icon: Smartphone, title: "Build real skills", text: "Short lessons on phones, email, jobs, and talking about your past." },
    { icon: Users, title: "Grow your support", text: "Reconnect with people and find new support you can count on." },
    { icon: HeartHandshake, title: "Find trusted help", text: "Your top 3 Maine resources — no endless lists." },
  ];
  return (
    <div className="container-app">
      <section className="grid items-center gap-8 pt-8 pb-10 md:grid-cols-2 md:pt-14">
        <div>
          <Badge variant="achievement" className="mb-4">
            <Sparkles aria-hidden /> Free · Private · Judgment-free
          </Badge>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Your next chapter <span className="text-primary-dark">starts here.</span>
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Project T.E.C.H. helps you get ready for life after release — one small, doable step at a time.
            Meet <strong className="text-ink">Second Take</strong>, your reentry coach.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/start">
                Get started <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/privacy">
                <ShieldCheck aria-hidden /> How we protect you
              </Link>
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
            <Clock aria-hidden className="size-4" /> Takes about 3 minutes. No account or password needed.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PathIllustration className="w-full drop-shadow-sm" />
        </motion.div>
      </section>

      <AffirmationCard />

      <section aria-labelledby="how-heading" className="py-10">
        <h2 id="how-heading" className="text-2xl font-bold text-ink">How it works</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-dark">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{text}</p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </ul>
      </section>

      <CoachMessage className="mb-10">
        Hi, I'm Second Take. I'm here to help you prepare — no judgment, ever. We'll only ask your first
        name and county. Nothing about your case, your record, or your release date.
      </CoachMessage>
    </div>
  );
}

function Dashboard() {
  const profile = useAppStore((s) => s.profile)!;
  const latest = useAppStore(selectLatestAssessment);
  const completed = useAppStore((s) => s.completedLessons);
  const path = useMemo(() => buildPath(latest, completed), [latest, completed]);
  const mission = currentLesson(path);
  const progress = overallProgress(completed);
  const streak = learningStreak(completed);
  const story = getStoryOfTheDay();

  return (
    <div className="container-app space-y-6 pt-6 sm:pt-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {greeting(profile.firstName)} 👋
        </h1>
        <p className="mt-1 text-ink-soft">{profile.county === "Outside Maine" || profile.county === "Not sure yet" ? "Maine" : `${profile.county} County, Maine`}</p>
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

      <AffirmationCard />

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
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${p.status === "current" ? "bg-primary text-on-bright" : "bg-muted text-ink-soft"}`}>
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
    </div>
  );
}
