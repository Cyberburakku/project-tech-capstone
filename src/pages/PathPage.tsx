import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotionConfig } from "framer-motion";
import { Award, Check, Clock, Lock, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { ModuleIcon } from "@/components/shared/ModuleIcon";
import { MODULE_STYLES } from "@/lib/moduleStyles";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { buildPath, currentLesson, moduleProgress, type PathLesson } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** Horizontal offsets that make the path wind like a trail. */
const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56];

export default function PathPage() {
  const latest = useAppStore(selectLatestAssessment);
  const completed = useAppStore((s) => s.completedLessons);
  const path = useMemo(() => buildPath(latest, completed), [latest, completed]);
  const current = currentLesson(path);
  const done = path.filter((p) => p.status === "completed");
  const upcoming = path.filter((p) => p.status === "locked");

  const groups = path.reduce<{ moduleId: string; items: PathLesson[] }[]>((acc, p) => {
    const last = acc[acc.length - 1];
    if (last && last.moduleId === p.module.id) last.items.push(p);
    else acc.push({ moduleId: p.module.id, items: [p] });
    return acc;
  }, []);

  return (
    <div className="container-app max-w-3xl">
      <PageHeader
        eyebrow="Learning path"
        title="Your path"
        description="Built from your check-in. One lesson unlocks at a time, so you can focus on what matters today."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-2 border-primary sm:col-span-3">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Current lesson</p>
              {current ? (
                <>
                  <h2 className="text-xl font-bold text-ink">{current.lesson.title}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                    <Clock aria-hidden className="size-4" /> {current.lesson.minutes} min · {current.module.title}
                  </p>
                </>
              ) : (
                <h2 className="text-xl font-bold text-ink">Every lesson complete — amazing work!</h2>
              )}
            </div>
            {current && (
              <Button asChild>
                <Link to={`/lesson/${current.lesson.id}`}>
                  <Play aria-hidden /> Start
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-3xl font-extrabold text-ink">{done.length}</p>
            <p className="text-sm font-semibold text-ink-soft">Completed lessons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-3xl font-extrabold text-ink">{upcoming.length}</p>
            <p className="text-sm font-semibold text-ink-soft">Upcoming lessons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-3xl font-extrabold text-ink">{path.length}</p>
            <p className="text-sm font-semibold text-ink-soft">Lessons in your path</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 space-y-12">
        {groups.map((group, gi) => {
          const module = group.items[0].module;
          const style = MODULE_STYLES[module.color];
          const mp = moduleProgress(module.id, completed);
          return (
            <section key={group.moduleId} aria-labelledby={`mod-${module.id}`}>
              <div className={cn("rounded-3xl p-5 text-ink", style.soft)}>
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-12 items-center justify-center rounded-2xl", style.soft, style.text)}>
                    <ModuleIcon icon={module.icon} className="size-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink">
                      Unit {gi + 1}
                      {gi === 0 && latest ? " · Your top priority" : ""}
                    </p>
                    <h2 id={`mod-${module.id}`} className="text-xl font-bold">
                      {module.title}
                    </h2>
                  </div>
                  {mp.isComplete && (
                    <Button asChild size="sm" variant="secondary">
                      <Link to={`/certificate/${module.id}`}>
                        <Award aria-hidden /> Certificate
                      </Link>
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-sm text-ink">{module.description}</p>
                <Progress
                  value={mp.percent}
                  className="mt-3 bg-card"
                  indicatorClassName={style.bg}
                  aria-label={`${module.title}: ${mp.done} of ${mp.total} lessons complete`}
                />
              </div>

              <ol className="mt-6 flex flex-col items-center gap-5">
                {group.items.map((p) => (
                  <Fragment key={p.lesson.id}>
                    <PathNode item={p} offset={OFFSETS[p.index % OFFSETS.length]} hex={style.hex} />
                  </Fragment>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function PathNode({ item, offset, hex }: { item: PathLesson; offset: number; hex: string }) {
  const reduce = useReducedMotionConfig();
  const { lesson, status } = item;
  const label = `${lesson.title}. ${status === "completed" ? "Completed" : status === "current" ? "Current lesson, ready to start" : "Locked"}. ${lesson.minutes} minutes.`;

  const circle = (
    <span
      className={cn(
        "relative flex size-20 items-center justify-center rounded-full border-b-[6px] text-white transition-transform",
        status === "completed" && "border-[color-mix(in_srgb,var(--color-sun)_65%,black)] bg-achievement text-on-bright",
        status === "current" && "border-[color-mix(in_srgb,var(--color-primary-strong)_60%,black)] bg-primary-strong hover:scale-105",
        status === "locked" && "border-input bg-muted text-ink-soft",
      )}
    >
      {status === "completed" && <Check aria-hidden className="size-9" strokeWidth={3} />}
      {status === "current" && <Play aria-hidden className="size-8 fill-current" />}
      {status === "locked" && <Lock aria-hidden className="size-7" />}
      {status === "current" && !reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 0 0 ${hex}` }}
          animate={{ boxShadow: [`0 0 0 0 ${hex}66`, `0 0 0 16px ${hex}00`] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
    </span>
  );

  return (
    <li className="flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {status === "current" && (
        <Badge variant="action" className="mb-2 animate-bounce motion-reduce:animate-none">
          Start here
        </Badge>
      )}
      {status === "locked" ? (
        <span aria-label={label} role="img">
          {circle}
        </span>
      ) : (
        <Link to={`/lesson/${lesson.id}`} aria-label={label} className="rounded-full">
          {circle}
        </Link>
      )}
      <span className={cn("mt-2 max-w-40 text-center text-sm font-semibold", status === "locked" ? "text-ink-soft" : "text-ink")}>
        {lesson.title}
      </span>
    </li>
  );
}
