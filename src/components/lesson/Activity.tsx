import { useState } from "react";
import { ArrowRight, Check, CheckCircle2, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { LessonActivity } from "@/types";

interface ActivityProps {
  lessonId: string;
  activity: LessonActivity;
  onComplete: (score: number) => void;
}

export function Activity(props: ActivityProps) {
  const { activity } = props;
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-ink">{activity.title}</h2>
      <p className="mt-1 text-ink-soft">{activity.instructions}</p>
      <div className="mt-6">
        {activity.type === "quiz" && <Quiz {...props} activity={activity} />}
        {activity.type === "checklist" && <Checklist {...props} activity={activity} />}
        {activity.type === "builder" && <Builder {...props} activity={activity} />}
      </div>
    </div>
  );
}

function Quiz({ activity, onComplete }: ActivityProps & { activity: Extract<LessonActivity, { type: "quiz" }> }) {
  const [qIndex, setQIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const q = activity.questions[qIndex];
  const isCorrect = choice === q.correctIndex;
  const isLast = qIndex === activity.questions.length - 1;

  const check = () => {
    setChecked(true);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };
  const next = () => {
    if (isLast) {
      onComplete(Math.round((correctCount / activity.questions.length) * 100));
      return;
    }
    setQIndex((i) => i + 1);
    setChoice(null);
    setChecked(false);
  };

  return (
    <div>
      <Progress
        value={((qIndex + (checked ? 1 : 0)) / activity.questions.length) * 100}
        aria-label={`Question ${qIndex + 1} of ${activity.questions.length}`}
        className="mb-4"
      />
      <fieldset>
        <legend className="text-lg font-bold text-ink">
          <span className="sr-only">Question {qIndex + 1} of {activity.questions.length}: </span>
          {q.prompt}
        </legend>
        <div className="mt-4 grid gap-3">
          {q.options.map((opt, i) => {
            const selected = choice === i;
            const showCorrect = checked && i === q.correctIndex;
            const showWrong = checked && selected && !isCorrect;
            return (
              <label
                key={opt}
                className={cn(
                  "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-ink shadow-[0_3px_0_0_var(--color-line)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/30",
                  selected && !checked && "border-primary-dark bg-primary-soft",
                  !selected && !showCorrect && "border-line",
                  showCorrect && "border-primary-dark bg-primary-soft",
                  showWrong && "border-crisis bg-crisis-soft",
                  checked && "cursor-default",
                )}
              >
                <input
                  type="radio"
                  name={`quiz-${qIndex}`}
                  className="sr-only"
                  checked={selected}
                  disabled={checked}
                  onChange={() => setChoice(i)}
                />
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-input",
                    selected && "border-primary-strong bg-primary-strong text-white",
                    showCorrect && "border-primary-strong bg-primary-strong text-white",
                    showWrong && "border-crisis bg-crisis text-white",
                  )}
                >
                  {showWrong ? <X className="size-4" /> : (selected || showCorrect) && <Check className="size-4" />}
                </span>
                <span className="font-medium">{opt}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite">
        {checked && (
          <div
            className={cn(
              "mt-4 rounded-2xl p-4",
              isCorrect ? "bg-primary-soft text-ink" : "bg-achievement-soft text-ink",
            )}
          >
            <p className="font-bold">{isCorrect ? "Nice work! ✅" : "Good try — here's the idea:"}</p>
            <p className="mt-1">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={choice === null} size="lg">
            Check answer
          </Button>
        ) : (
          <Button onClick={next} size="lg">
            {isLast ? "Finish activity" : "Next question"} <ArrowRight aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}

function Checklist({
  lessonId,
  activity,
  onComplete,
}: ActivityProps & { activity: Extract<LessonActivity, { type: "checklist" }> }) {
  const saved = useAppStore((s) => s.checklistState[lessonId]);
  const saveChecklist = useAppStore((s) => s.saveChecklist);
  const [checks, setChecks] = useState<boolean[]>(saved ?? activity.items.map(() => false));
  const count = checks.filter(Boolean).length;
  const minimum = Math.ceil(activity.items.length / 2);

  const toggle = (i: number) => {
    const next = checks.map((c, j) => (j === i ? !c : c));
    setChecks(next);
    saveChecklist(lessonId, next);
  };

  return (
    <div>
      <ul className="grid gap-3">
        {activity.items.map((item, i) => (
          <li key={item}>
            <label
              className={cn(
                "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card px-4 py-3 text-ink shadow-[0_3px_0_0_var(--color-line)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/30",
                checks[i] ? "border-primary-dark bg-primary-soft" : "border-line",
              )}
            >
              <input type="checkbox" className="sr-only" checked={checks[i]} onChange={() => toggle(i)} />
              <span
                aria-hidden
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg border-2",
                  checks[i] ? "border-primary-strong bg-primary-strong text-white" : "border-input",
                )}
              >
                {checks[i] && <Check className="size-4" />}
              </span>
              <span className="font-medium">{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {count} of {activity.items.length} checked.{" "}
        {count < minimum
          ? `Check at least ${minimum} to continue — you can come back to the rest anytime.`
          : "Great progress!"}
      </p>
      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          disabled={count < minimum}
          onClick={() => onComplete(Math.round((count / activity.items.length) * 100))}
        >
          Continue <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function Builder({
  lessonId,
  activity,
  onComplete,
}: ActivityProps & { activity: Extract<LessonActivity, { type: "builder" }> }) {
  const saved = useAppStore((s) => s.builderAnswers[lessonId]);
  const saveBuilder = useAppStore((s) => s.saveBuilder);
  const [values, setValues] = useState<Record<string, string>>(
    saved ?? Object.fromEntries(activity.fields.map((f) => [f.id, ""])),
  );
  const [copied, setCopied] = useState(false);

  const preview = activity.template.replace(/\{(\w+)\}/g, (_, id: string) =>
    values[id]?.trim() ? values[id].trim().replace(/[.!?]+$/, "") : "…",
  );
  const allFilled = activity.fields.every((f) => values[f.id]?.trim());

  const update = (id: string, v: string) => {
    const next = { ...values, [id]: v.slice(0, 200) };
    setValues(next);
    saveBuilder(lessonId, next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid gap-6 web:grid-cols-2">
      <div className="space-y-4">
        {activity.fields.map((f) => (
          <div key={f.id} className="space-y-2">
            <Label htmlFor={`${lessonId}-${f.id}`}>{f.label}</Label>
            <Input
              id={`${lessonId}-${f.id}`}
              placeholder={f.placeholder}
              value={values[f.id] ?? ""}
              onChange={(e) => update(f.id, e.target.value)}
              maxLength={200}
            />
          </div>
        ))}
      </div>
      <div>
        <div className="sticky top-24 rounded-3xl border-2 border-dashed border-primary bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Live preview</p>
          <p className="mt-2 text-lg leading-relaxed text-ink" aria-live="polite">
            {preview}
          </p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={copy} disabled={!allFilled}>
            {copied ? <CheckCircle2 aria-hidden /> : <Copy aria-hidden />}
            {copied ? "Copied!" : "Copy text"}
          </Button>
          <p className="mt-3 text-xs text-ink-soft">This stays on your device. It is never uploaded.</p>
        </div>
      </div>
      <div className="flex justify-end md:col-span-2">
        <Button size="lg" disabled={!allFilled} onClick={() => onComplete(100)}>
          Continue <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
