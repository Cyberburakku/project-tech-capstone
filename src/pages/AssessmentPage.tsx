import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CoachMessage } from "@/components/shared/SecondTake";
import { assessmentQuestions, CATEGORY_META } from "@/data/assessment";
import { useAppStore } from "@/store/useAppStore";
import { matchResources } from "@/data/resources";
import { cn } from "@/lib/utils";

const ENCOURAGEMENT: Record<number, string> = {
  2: "Great start. Keep going!",
  4: "You're doing great — almost halfway.",
  6: "Past halfway. Honest answers help me help you.",
  8: "Just two more. You've got this.",
};

export default function AssessmentPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const answers = useAppStore((s) => s.draftAnswers);
  const setDraftAnswer = useAppStore((s) => s.setDraftAnswer);
  const submitAssessment = useAppStore((s) => s.submitAssessment);
  const saveRecommendations = useAppStore((s) => s.saveRecommendations);
  const profile = useAppStore((s) => s.profile);
  const isRetake = useAppStore((s) => s.assessments.length > 0);

  const firstUnanswered = assessmentQuestions.findIndex((q) => !answers[q.id]);
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);
  const [direction, setDirection] = useState(1);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const question = assessmentQuestions[index];
  const selected = answers[question.id];
  const isLast = index === assessmentQuestions.length - 1;
  const answeredCount = assessmentQuestions.filter((q) => answers[q.id]).length;

  useEffect(() => {
    headingRef.current?.focus();
  }, [index]);

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => Math.min(assessmentQuestions.length - 1, Math.max(0, i + delta)));
  };

  const finish = () => {
    const result = submitAssessment();
    if (!result || !profile) return;
    saveRecommendations(
      result.id,
      matchResources({ scores: result.scores, county: profile.county, needTags: result.needTags }),
    );
    navigate("/results", { state: { fresh: true } });
  };

  const onKeyDownOptions = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const opts = question.options;
    const current = opts.findIndex((o) => o.id === selected);
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = opts[(current + step + opts.length) % opts.length];
    setDraftAnswer(question.id, next.id);
    document.getElementById(`opt-${question.id}-${next.id}`)?.focus();
  };

  const meta = CATEGORY_META[question.category];

  return (
    <div className="container-app max-w-2xl pt-6 sm:pt-10">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-soft">
          <span>
            Question {index + 1} of {assessmentQuestions.length}
          </span>
          <span>{isRetake ? "Readiness re-check" : "Readiness Check-in"}</span>
        </div>
        <Progress
          value={(answeredCount / assessmentQuestions.length) * 100}
          aria-label={`${answeredCount} of ${assessmentQuestions.length} questions answered`}
          className="h-4"
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={question.id}
          custom={direction}
          initial={reduce ? false : { opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.22 }}
          aria-labelledby={`${question.id}-heading`}
        >
          <Badge variant="muted" className="mb-3">
            {meta.longLabel}
          </Badge>
          <h1
            id={`${question.id}-heading`}
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-extrabold leading-snug text-ink outline-none sm:text-3xl"
          >
            {question.prompt}
          </h1>
          {question.helper && <p className="mt-2 text-ink-soft">{question.helper}</p>}

          <div
            role="radiogroup"
            aria-labelledby={`${question.id}-heading`}
            className="mt-6 grid gap-3"
            onKeyDown={onKeyDownOptions}
          >
            {question.options.map((option, i) => {
              const isSelected = selected === option.id;
              const tabbable = isSelected || (!selected && i === 0);
              return (
                <button
                  key={option.id}
                  id={`opt-${question.id}-${option.id}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={tabbable ? 0 : -1}
                  onClick={() => setDraftAnswer(question.id, option.id)}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left text-base font-medium text-ink shadow-[0_3px_0_0_#eee5d8] transition-all hover:border-primary hover:bg-primary-soft/50",
                    isSelected
                      ? "border-primary-dark bg-primary-soft shadow-[0_3px_0_0_#1a7f76]"
                      : "border-line",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
                      isSelected ? "border-primary-dark bg-primary-dark text-white" : "border-input",
                    )}
                    aria-hidden
                  >
                    {isSelected && <Check className="size-4" />}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.section>
      </AnimatePresence>

      <div aria-live="polite" className="mt-6 min-h-16">
        {ENCOURAGEMENT[answeredCount] && selected && (
          <CoachMessage>{ENCOURAGEMENT[answeredCount]}</CoachMessage>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => go(-1)} disabled={index === 0}>
          <ArrowLeft aria-hidden /> Back
        </Button>
        {isLast ? (
          <Button onClick={finish} disabled={answeredCount < assessmentQuestions.length} size="lg">
            See my results <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button onClick={() => go(1)} disabled={!selected} size="lg">
            Next <ArrowRight aria-hidden />
          </Button>
        )}
      </div>
      {isLast && answeredCount < assessmentQuestions.length && (
        <p className="mt-3 text-right text-sm text-ink-soft">Please answer every question to see your results.</p>
      )}
    </div>
  );
}
