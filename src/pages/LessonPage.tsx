import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotionConfig } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, BookOpen, Clock, Footprints, Lock, PenLine, Puzzle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LessonContent } from "@/components/lesson/LessonContent";
import { Activity } from "@/components/lesson/Activity";
import { MentorStoryCard } from "@/components/shared/MentorStoryCard";
import { ResourceCard } from "@/components/shared/ResourceCard";
import { CoachMessage } from "@/components/shared/SecondTake";
import { Celebration } from "@/components/shared/Celebration";
import { ModuleIcon } from "@/components/shared/ModuleIcon";
import { getLesson, getModule } from "@/data/modules";
import { getMentorStory } from "@/data/mentors";
import { matchResources } from "@/data/resources";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { buildPath, currentLesson, isLessonUnlocked, moduleProgress } from "@/lib/progress";
import { LESSON_CHEERS } from "@/lib/coach";
import { cn } from "@/lib/utils";
import type { NeedTag } from "@/types";

const STEPS = [
  { key: "learn", label: "Lesson", icon: BookOpen },
  { key: "activity", label: "Activity", icon: Puzzle },
  { key: "reflect", label: "Reflection", icon: PenLine },
  { key: "mentor", label: "Mentor Story", icon: Footprints },
  { key: "done", label: "Complete", icon: Trophy },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

/** Resource tags that fit each module, used for the end-of-lesson recommendation. */
const MODULE_TAGS: Record<string, NeedTag[]> = {
  technology: ["technology", "employment"],
  "support-network": ["support", "recovery"],
  "talking-about-your-record": ["employment", "legal"],
};

export default function LessonPage() {
  const { lessonId = "" } = useParams();
  const lesson = getLesson(lessonId);
  const latest = useAppStore(selectLatestAssessment);
  const completed = useAppStore((s) => s.completedLessons);
  const path = useMemo(() => buildPath(latest, completed), [latest, completed]);

  if (!lesson) return <Navigate to="/path" replace />;
  if (!isLessonUnlocked(path, lesson.id)) {
    const current = currentLesson(path);
    return (
      <div className="container-app max-w-xl pt-12 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-muted text-ink-soft">
          <Lock aria-hidden className="size-9" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">This lesson is still locked</h1>
        <p className="mt-2 text-ink-soft">
          Lessons unlock one at a time so you can focus. Finish your current lesson to unlock the next one.
        </p>
        {current && (
          <Button asChild size="lg" className="mt-6">
            <Link to={`/lesson/${current.lesson.id}`}>Go to {current.lesson.title}</Link>
          </Button>
        )}
      </div>
    );
  }
  return <LessonFlow key={lesson.id} lessonId={lesson.id} />;
}

function LessonFlow({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId)!;
  const module = getModule(lesson.moduleId)!;
  const mentor = getMentorStory(lesson.mentorStoryId);
  const navigate = useNavigate();
  const reduce = useReducedMotionConfig();

  const profile = useAppStore((s) => s.profile)!;
  const latest = useAppStore(selectLatestAssessment);
  const completedLessons = useAppStore((s) => s.completedLessons);
  const alreadyDone = Boolean(completedLessons[lessonId]);
  const savedReflection = useAppStore((s) => s.reflections[lessonId]);
  const completeLesson = useAppStore((s) => s.completeLesson);
  const saveReflection = useAppStore((s) => s.saveReflection);
  const issueCertificate = useAppStore((s) => s.issueCertificate);

  const [step, setStep] = useState<StepKey>("learn");
  const [activityScore, setActivityScore] = useState<number | undefined>(undefined);
  const [reflection, setReflection] = useState(savedReflection?.text ?? "");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cheer = useMemo(() => LESSON_CHEERS[Math.floor(Math.random() * LESSON_CHEERS.length)], []);

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const wordCount = reflection.trim() ? reflection.trim().split(/\s+/).length : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, reduce]);

  const finishLesson = () => {
    completeLesson(lessonId, activityScore);
    setStep("done");
  };

  // After completion: module state + next lesson (computed from the fresh store state).
  const mp = moduleProgress(module.id, completedLessons);
  const nextPath = buildPath(latest, completedLessons);
  const next = currentLesson(nextPath);

  useEffect(() => {
    if (step === "done" && mp.isComplete) issueCertificate(module.id);
  }, [step, mp.isComplete, issueCertificate, module.id]);

  const recommendation = useMemo(() => {
    if (!latest) return null;
    const tags = [...MODULE_TAGS[module.id], ...latest.needTags.filter((t) => !MODULE_TAGS[module.id].includes(t))];
    return matchResources({ scores: latest.scores, county: profile.county, needTags: tags }, 1)[0] ?? null;
  }, [latest, module.id, profile.county]);

  return (
    <div className="container-app max-w-3xl pt-6">
      {step === "done" && <Celebration />}

      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" aria-label="Back to my path">
          <Link to="/path">
            <ArrowLeft aria-hidden />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-ink-soft">
            <ModuleIcon icon={module.icon} className="size-4" /> {module.title} · Lesson {lesson.order} of{" "}
            {module.lessons.length}
          </p>
          <nav aria-label="Lesson steps" className="mt-2">
            <ol className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <li key={s.key} className="flex-1">
                  <span
                    className={cn(
                      "block h-2.5 rounded-full transition-colors",
                      i < stepIndex ? "bg-primary" : i === stepIndex ? "bg-action" : "bg-muted",
                    )}
                    aria-hidden
                  />
                  <span className="sr-only">
                    {s.label}
                    {i < stepIndex ? " (done)" : i === stepIndex ? " (current step)" : ""}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <motion.div
        key={step}
        initial={reduce ? false : { x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        {step === "learn" && (
          <>
            <Badge variant="muted" className="mb-3">
              <Clock aria-hidden /> {lesson.minutes} min
            </Badge>
            <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-extrabold tracking-tight text-ink outline-none sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-lg text-ink-soft">{lesson.subtitle}</p>
            <div className="mt-6">
              <LessonContent lesson={lesson} />
            </div>
            <div className="mt-8 flex justify-end">
              <Button size="lg" onClick={() => setStep("activity")}>
                Try the activity <ArrowRight aria-hidden />
              </Button>
            </div>
          </>
        )}

        {step === "activity" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Activity: {lesson.activity.title}
            </h1>
            <Card>
              <CardContent className="p-6">
                <Activity
                  lessonId={lessonId}
                  activity={lesson.activity}
                  onComplete={(score) => {
                    setActivityScore(score);
                    setStep("reflect");
                  }}
                />
              </CardContent>
            </Card>
          </>
        )}

        {step === "reflect" && (
          <>
            <CoachMessage className="mb-6">
              Take a breath. There are no wrong answers here — this is just for you.
            </CoachMessage>
            <Card>
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Reflection</p>
                <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl font-extrabold text-ink outline-none">
                  <Label htmlFor="reflection" className="text-2xl font-extrabold leading-snug">
                    {lesson.reflection.prompt}
                  </Label>
                </h1>
                <p id="reflection-help" className="mt-2 text-sm text-ink-soft">
                  {lesson.reflection.helper}
                </p>
                <Textarea
                  id="reflection"
                  className="mt-4"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value.slice(0, 2000))}
                  aria-describedby="reflection-help reflection-count"
                  placeholder="Write a few sentences…"
                  maxLength={2000}
                />
                <p id="reflection-count" className="mt-2 text-sm text-ink-soft">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                  {wordCount < 3 && " · write at least 3 words to continue"}
                </p>
                <div className="mt-6 flex justify-between gap-3">
                  <Button variant="secondary" onClick={() => setStep("activity")}>
                    <ArrowLeft aria-hidden /> Back
                  </Button>
                  <Button
                    size="lg"
                    disabled={wordCount < 3}
                    onClick={() => {
                      saveReflection(lessonId, reflection.trim());
                      setStep("mentor");
                    }}
                  >
                    Save reflection <ArrowRight aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {step === "mentor" && (
          <>
            <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Someone Who Walked This Path
            </h1>
            {mentor && <MentorStoryCard story={mentor} />}
            <div className="mt-6 flex justify-end">
              <Button size="lg" onClick={finishLesson}>
                {alreadyDone ? "Finish review" : "Complete lesson"} <ArrowRight aria-hidden />
              </Button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="text-center">
            <motion.span
              initial={reduce ? false : { scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12 }}
              className="mx-auto flex size-24 items-center justify-center rounded-full bg-achievement shadow-lift"
              aria-hidden
            >
              <Trophy className="size-12 text-on-bright" />
            </motion.span>
            <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl font-extrabold text-ink outline-none">
              {cheer}
            </h1>
            <p className="mt-2 text-lg text-ink-soft">
              You completed <strong className="text-ink">{lesson.title}</strong>.
            </p>
            <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
              {lesson.skills.map((s) => (
                <Badge key={s} variant="achievement">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-ink-soft">
              {module.title}: {mp.done} of {mp.total} lessons complete
            </p>

            {mp.isComplete && (
              <Card className="mx-auto mt-6 max-w-lg border-2 border-achievement bg-achievement-soft">
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <Award aria-hidden className="size-10 text-achievement-dark" />
                  <p className="text-xl font-bold text-ink">You earned a certificate!</p>
                  <p className="text-ink-soft">You finished the whole {module.title} module.</p>
                  <Button asChild size="lg">
                    <Link to={`/certificate/${module.id}`}>View my certificate</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {recommendation && (
              <section aria-labelledby="rec-heading" className="mx-auto mt-8 max-w-xl text-left">
                <h2 id="rec-heading" className="mb-3 text-lg font-bold text-ink">
                  Recommended resource for this step
                </h2>
                <ResourceCard match={recommendation} />
              </section>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {next && (
                <Button size="lg" onClick={() => navigate(`/lesson/${next.lesson.id}`)}>
                  Next: {next.lesson.title} <ArrowRight aria-hidden />
                </Button>
              )}
              <Button asChild variant="secondary" size="lg">
                <Link to="/progress">See my progress</Link>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
