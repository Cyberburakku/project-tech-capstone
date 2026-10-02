import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotionConfig } from "framer-motion";
import { ArrowRight, Award, Check, Clock, Lock, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { RadialScore } from "@/components/shared/RadialScore";
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

  const total = path.length;
  const percent = Math.round((done.length / total) * 100);
  const next = upcoming[0] ?? null;

  return (
    <div className="container-app max-w-3xl">
      <PageHeader
        eyebrow="My Path"
        title="Your path forward"
        description="Built from your check-in, one lesson at a time."
      />

      {/* Big progress at a glance */}
      <Card className="border-2 border-primary">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-5">
            <RadialScore value={percent} size={104} stroke={11} label="Percent of your path complete" sublabel="% done" />
            <div className="min-w-0 flex-1">
              <p className="text-3xl font-extrabold text-ink">
                {done.length}
                <span className="text-lg font-bold text-ink-2"> / {total} lessons</span>
              </p>
              <Progress value={percent} className="mt-2 h-4" aria-label={`${done.length} of ${total} lessons complete`} />
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink" aria-label="Legend">
                <li className="flex items-center gap-1.5"><span className="grid size-5 place-items-center rounded-full bg-achievement text-on-bright"><Check aria-hidden className="size-3" strokeWidth={3.5} /></span> Done</li>
                <li className="flex items-center gap-1.5"><span className="grid size-5 place-items-center rounded-full bg-primary-strong text-white"><Play aria-hidden className="size-2.5 fill-current" /></span> Now</li>
                <li className="flex items-center gap-1.5"><span className="grid size-5 place-items-center rounded-full border-2 border-dashed border-primary bg-primary-soft text-primary-dark"><ArrowRight aria-hidden className="size-3" /></span> Next</li>
                <li className="flex items-center gap-1.5"><span className="grid size-5 place-items-center rounded-full bg-muted text-ink-soft"><Lock aria-hidden className="size-2.5" /></span> Locked</li>
              </ul>
            </div>
          </div>
          {current ? (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-primary-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Now</p>
                <p className="text-lg font-bold text-ink">{current.lesson.title}</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                  <Clock aria-hidden className="size-4" /> {current.lesson.minutes} min
                  {next && <span className="truncate"> · Next: {next.lesson.title}</span>}
                </p>
              </div>
              <Button asChild size="lg">
                <Link to={`/lesson/${current.lesson.id}`}>
                  <Play aria-hidden className="fill-current" /> Start
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-achievement-soft p-4 text-lg font-bold text-ink">Every lesson complete. Amazing work!</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-10 space-y-12">
        {groups.map((group, gi) => {
          const module = group.items[0].module;
          const style = MODULE_STYLES[module.color];
          const mp = moduleProgress(module.id, completed);
          return (
            <section key={group.moduleId} aria-labelledby={`mod-${module.id}`}>
              <div className={cn("rounded-3xl p-5 text-ink", style.soft)}>
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl bg-card", style.text)}>
                    <ModuleIcon icon={module.icon} className="size-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink">
                      Unit {gi + 1}
                      {gi === 0 && latest ? " · Top priority" : ""}
                    </p>
                    <h2 id={`mod-${module.id}`} className="text-xl font-bold">
                      {module.title}
                    </h2>
                  </div>
                  <span className="shrink-0 text-lg font-extrabold">
                    {mp.done}/{mp.total}
                  </span>
                </div>
                <Progress
                  value={mp.percent}
                  className="mt-3 h-4 bg-card"
                  indicatorClassName={style.bg}
                  aria-label={`${module.title}: ${mp.done} of ${mp.total} lessons complete`}
                />
                {mp.isComplete && (
                  <Button asChild size="sm" variant="secondary" className="mt-3">
                    <Link to={`/certificate/${module.id}`}>
                      <Award aria-hidden /> View certificate
                    </Link>
                  </Button>
                )}
              </div>

              <ol className="mt-6 flex flex-col items-center gap-6">
                {group.items.map((p) => (
                  <Fragment key={p.lesson.id}>
                    <PathNode item={p} isNext={p.lesson.id === next?.lesson.id} offset={OFFSETS[p.index % OFFSETS.length]} hex={style.hex} />
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

function PathNode({ item, isNext, offset, hex }: { item: PathLesson; isNext: boolean; offset: number; hex: string }) {
  const reduce = useReducedMotionConfig();
  const { lesson, status } = item;
  const label = `${lesson.title}. ${status === "completed" ? "Completed" : status === "current" ? "Current lesson, ready to start" : isNext ? "Up next, unlocks after the current lesson" : "Locked"}. ${lesson.minutes} minutes.`;

  const circle = (
    <span
      className={cn(
        "relative flex size-20 items-center justify-center rounded-full border-b-[6px] text-white transition-transform sm:size-24",
        status === "completed" && "border-[color-mix(in_srgb,var(--color-sun)_65%,black)] bg-achievement text-on-bright",
        status === "current" && "border-[color-mix(in_srgb,var(--color-primary-strong)_60%,black)] bg-primary-strong hover:scale-105",
        status === "locked" && !isNext && "border-input bg-muted text-ink-soft",
        status === "locked" && isNext && "border-2 border-dashed border-primary bg-primary-soft text-primary-dark",
      )}
    >
      {status === "completed" && <Check aria-hidden className="size-9" strokeWidth={3} />}
      {status === "current" && <Play aria-hidden className="size-8 fill-current" />}
      {status === "locked" && !isNext && <Lock aria-hidden className="size-7" />}
      {status === "locked" && isNext && <ArrowRight aria-hidden className="size-8" />}
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
      {isNext && (
        <Badge variant="default" className="mb-2">
          Up next
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
      <span className={cn("mt-2 max-w-44 text-center text-sm font-semibold", status === "locked" && !isNext ? "text-ink-soft" : "text-ink")}>
        {lesson.title}
      </span>
      <span
        className={cn(
          "mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
          status === "completed" ? "bg-achievement-soft text-ink" : status === "current" ? "bg-primary-strong text-white" : "bg-muted text-ink-2",
        )}
      >
        {status === "completed" ? <Check aria-hidden className="size-3" strokeWidth={3} /> : <Clock aria-hidden className="size-3" />}
        {status === "completed" ? "Done" : `${lesson.minutes} min`}
      </span>
    </li>
  );
}
