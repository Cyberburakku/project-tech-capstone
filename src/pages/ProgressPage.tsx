import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Award, BookOpen, Flame, Lock, PenLine, RefreshCw, Target, Trash2, TrendingUp, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { RadialScore } from "@/components/shared/RadialScore";
import { CoachMessage } from "@/components/shared/SecondTake";
import { ModuleIcon } from "@/components/shared/ModuleIcon";
import { MODULE_STYLES } from "@/lib/moduleStyles";
import { useAppStore } from "@/store/useAppStore";
import { modules, getLesson } from "@/data/modules";
import { CATEGORY_META, CATEGORY_ORDER } from "@/data/assessment";
import { learningStreak, moduleProgress, overallProgress } from "@/lib/progress";
import { improvementMessage } from "@/lib/coach";
import { cn, formatDate } from "@/lib/utils";

export default function ProgressPage() {
  const navigate = useNavigate();
  const assessments = useAppStore((s) => s.assessments);
  const completed = useAppStore((s) => s.completedLessons);
  const reflections = useAppStore((s) => s.reflections);
  const certificates = useAppStore((s) => s.certificates);
  const resetAll = useAppStore((s) => s.resetAll);
  const [confirmReset, setConfirmReset] = useState(false);

  const first = assessments[0];
  const latest = assessments[assessments.length - 1];
  const progress = overallProgress(completed);
  const streak = learningStreak(completed);
  const modulesDone = modules.filter((m) => moduleProgress(m.id, completed).isComplete).length;
  const reflectionEntries = Object.entries(reflections).sort((a, b) => b[1].savedAt.localeCompare(a[1].savedAt));

  const stats = [
    { icon: Target, label: "Check-ins taken", value: assessments.length },
    { icon: BookOpen, label: "Lessons done", value: `${progress.done}/${progress.total}` },
    { icon: PenLine, label: "Reflections", value: reflectionEntries.length },
    { icon: Award, label: "Modules complete", value: `${modulesDone}/${modules.length}` },
    { icon: Flame, label: "Day streak", value: streak },
  ];

  return (
    <div className="container-app">
      <PageHeader eyebrow="Progress" title="Look how far you've come">
        <Button asChild variant="secondary">
          <Link to="/assessment">
            <RefreshCw aria-hidden /> Retake check-in
          </Link>
        </Button>
      </PageHeader>

      {assessments.length > 1 && <CoachMessage className="mb-6">{improvementMessage(first, latest)}</CoachMessage>}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(({ icon: Icon, label, value }) => (
          <li key={label}>
            <Card className="h-full">
              <CardContent className="p-4">
                <Icon aria-hidden className="size-6 text-primary-dark" />
                <p className="mt-2 text-2xl font-extrabold text-ink">{value}</p>
                <p className="text-sm text-ink-soft">{label}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp aria-hidden className="size-5 text-primary-dark" /> Readiness improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-around gap-4">
              <div className="text-center">
                <RadialScore value={first.overall} size={110} stroke={10} color="#C9BBA6" label="First check-in" />
                <p className="mt-1 text-sm font-semibold text-ink-soft">First · {formatDate(first.takenAt)}</p>
              </div>
              <div className="text-center">
                <RadialScore value={latest.overall} size={110} stroke={10} label="Latest check-in" />
                <p className="mt-1 text-sm font-semibold text-ink-soft">Latest · {formatDate(latest.takenAt)}</p>
              </div>
            </div>
            <table className="mt-6 w-full text-left text-sm">
              <caption className="sr-only">Readiness score by category, first versus latest check-in</caption>
              <thead>
                <tr className="text-ink-soft">
                  <th scope="col" className="py-2 font-semibold">Area</th>
                  <th scope="col" className="py-2 text-right font-semibold">First</th>
                  <th scope="col" className="py-2 text-right font-semibold">Latest</th>
                  <th scope="col" className="py-2 text-right font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_ORDER.map((k) => {
                  const diff = latest.scores[k] - first.scores[k];
                  return (
                    <tr key={k} className="border-t border-line">
                      <th scope="row" className="py-2 font-semibold text-ink">
                        <span className="mr-2 inline-block size-2.5 rounded-full" style={{ background: CATEGORY_META[k].hex }} aria-hidden />
                        {CATEGORY_META[k].label}
                      </th>
                      <td className="py-2 text-right text-ink">{first.scores[k]}</td>
                      <td className="py-2 text-right text-ink">{latest.scores[k]}</td>
                      <td className={cn("py-2 text-right font-bold", diff > 0 ? "text-primary-dark" : diff < 0 ? "text-action-dark" : "text-ink-soft")}>
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {assessments.length === 1 && (
              <p className="mt-4 rounded-2xl bg-primary-soft p-3 text-sm text-ink">
                Finish a few lessons, then retake your check-in to see your growth.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modules & certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((m) => {
              const mp = moduleProgress(m.id, completed);
              const style = MODULE_STYLES[m.color];
              const cert = certificates[m.id];
              return (
                <div key={m.id} className="rounded-2xl border border-line p-4">
                  <div className="flex items-center gap-3">
                    <span className={cn("flex size-10 items-center justify-center rounded-xl text-ink", style.bg)}>
                      <ModuleIcon icon={m.icon} className="size-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-ink">{m.title}</p>
                      <p className="text-sm text-ink-soft">
                        {mp.done} of {mp.total} lessons
                      </p>
                    </div>
                    {mp.isComplete ? (
                      <Button asChild size="sm">
                        <Link to={`/certificate/${m.id}`}>
                          <Award aria-hidden /> Certificate
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="muted">
                        <Lock aria-hidden /> Certificate
                      </Badge>
                    )}
                  </div>
                  <Progress
                    value={mp.percent}
                    className="mt-3"
                    indicatorClassName={style.bg}
                    aria-label={`${m.title}: ${mp.percent}% complete`}
                  />
                  {cert && <p className="mt-2 text-xs text-ink-soft">Earned {formatDate(cert.issuedAt)}</p>}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenLine aria-hidden className="size-5 text-primary-dark" /> My reflection journal
          </CardTitle>
          <p className="text-sm text-ink-soft">Private — saved only on this device.</p>
        </CardHeader>
        <CardContent>
          {reflectionEntries.length === 0 ? (
            <p className="text-ink-soft">Your reflections will show up here after your first lesson.</p>
          ) : (
            <ul className="space-y-3">
              {reflectionEntries.map(([lessonId, r]) => {
                const l = getLesson(lessonId);
                return (
                  <li key={lessonId} className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-sm font-bold text-ink">{l?.title}</p>
                    <p className="text-xs text-ink-soft">{l?.reflection.prompt}</p>
                    <p className="mt-2 whitespace-pre-wrap text-ink">{r.text}</p>
                    <p className="mt-2 text-xs text-ink-soft">{formatDate(r.savedAt)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-ink">Your data, your choice</h2>
            <p className="text-sm text-ink-soft">Update your name or county, or clear everything from this device.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to="/start">
                <UserPen aria-hidden /> Edit details
              </Link>
            </Button>
            {confirmReset ? (
              <>
                <Button
                  size="sm"
                  className="bg-crisis-dark shadow-none hover:bg-[#9b1624]"
                  onClick={() => {
                    resetAll();
                    navigate("/");
                  }}
                >
                  Yes, clear my data
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
                <Trash2 aria-hidden /> Clear device data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
