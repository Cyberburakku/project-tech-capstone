import { assessmentQuestions, CATEGORY_ORDER } from "@/data/assessment";
import type {
  AssessmentAnswers,
  AssessmentResult,
  CategoryKey,
  ModuleId,
  NeedTag,
  ScoreSet,
} from "@/types";
import { uuid } from "@/lib/utils";

/** Which module best strengthens each readiness category. */
export const CATEGORY_TO_MODULE: Record<CategoryKey, ModuleId> = {
  technology: "technology",
  support: "support-network",
  hope: "support-network",
  resources: "support-network",
  employment: "talking-about-your-record",
};

export function isComplete(answers: AssessmentAnswers): boolean {
  return assessmentQuestions.every((q) => Boolean(answers[q.id]));
}

/** Average the option scores for each category (2 questions each). */
export function computeScores(answers: AssessmentAnswers): ScoreSet {
  const totals = {} as Record<CategoryKey, { sum: number; count: number }>;
  for (const key of CATEGORY_ORDER) totals[key] = { sum: 0, count: 0 };

  for (const q of assessmentQuestions) {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (!option) continue;
    totals[q.category].sum += option.score;
    totals[q.category].count += 1;
  }

  const scores = {} as ScoreSet;
  for (const key of CATEGORY_ORDER) {
    const { sum, count } = totals[key];
    scores[key] = count ? Math.round(sum / count) : 0;
  }
  return scores;
}

export function overallScore(scores: ScoreSet): number {
  const values = CATEGORY_ORDER.map((k) => scores[k]);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Highest score; ties resolved by CATEGORY_ORDER. */
export function topStrength(scores: ScoreSet): CategoryKey {
  return CATEGORY_ORDER.reduce((best, k) => (scores[k] > scores[best] ? k : best));
}

/** Lowest score; ties resolved by CATEGORY_ORDER. */
export function topOpportunity(scores: ScoreSet): CategoryKey {
  return CATEGORY_ORDER.reduce((worst, k) => (scores[k] < scores[worst] ? k : worst));
}

/**
 * Need tags in priority order. Q10 ("what will you need help with first")
 * always leads so the resource engine can weight it most heavily.
 */
export function collectNeedTags(answers: AssessmentAnswers): NeedTag[] {
  const ordered = [...assessmentQuestions].sort((a, b) =>
    a.id === "q10" ? -1 : b.id === "q10" ? 1 : a.number - b.number,
  );
  const tags: NeedTag[] = [];
  for (const q of ordered) {
    const option = q.options.find((o) => o.id === answers[q.id]);
    for (const tag of option?.tags ?? []) if (!tags.includes(tag)) tags.push(tag);
  }
  return tags;
}

export function scoreAssessment(answers: AssessmentAnswers, takenAt = new Date()): AssessmentResult {
  const scores = computeScores(answers);
  return {
    id: uuid(),
    takenAt: takenAt.toISOString(),
    answers,
    scores,
    overall: overallScore(scores),
    topStrength: topStrength(scores),
    topOpportunity: topOpportunity(scores),
    needTags: collectNeedTags(answers),
  };
}

/**
 * Order the three modules for the learning path.
 * The module that serves the top opportunity comes first; the rest follow
 * by how low the categories they strengthen score (lowest first).
 */
export function orderModules(scores: ScoreSet): ModuleId[] {
  const first = CATEGORY_TO_MODULE[topOpportunity(scores)];
  const need = (id: ModuleId) => {
    const cats = (Object.keys(CATEGORY_TO_MODULE) as CategoryKey[]).filter(
      (c) => CATEGORY_TO_MODULE[c] === id,
    );
    return Math.min(...cats.map((c) => scores[c]));
  };
  const rest = (["technology", "support-network", "talking-about-your-record"] as ModuleId[])
    .filter((id) => id !== first)
    .sort((a, b) => need(a) - need(b));
  return [first, ...rest];
}

/**
 * Where a 0–100 value lands, in words. The band leads on screen; the number
 * is only shown small, as a detail.
 */
export function scoreBand(score: number): { label: string; message: string } {
  if (score >= 76) return { label: "Well Prepared", message: "You have a solid base here." };
  if (score >= 51) return { label: "Making Real Progress", message: "You're on your way. Keep building." };
  if (score >= 26) return { label: "Building Momentum", message: "A few steps here will go a long way." };
  return { label: "Just Getting Started", message: "Everyone starts somewhere. This is your starting line." };
}
