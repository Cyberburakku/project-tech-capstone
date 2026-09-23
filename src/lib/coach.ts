import { CATEGORY_META } from "@/data/assessment";
import type { AssessmentResult, CategoryKey } from "@/types";

/**
 * Second Take's built-in coaching voice. These messages are generated on the
 * device from the learner's scores and progress, so the coach works offline
 * and never needs to send personal data anywhere.
 */

const STRENGTH_LINES: Record<CategoryKey, string> = {
  technology: "You already have real comfort with technology. That will open a lot of doors.",
  support: "You have people in your corner. That is one of the strongest predictors of success.",
  employment: "You feel ready to work, and employers notice that kind of confidence.",
  hope: "Your hope is strong. Hold onto that — it fuels everything else.",
  resources: "You know where to turn for help. That is a skill many people are still building.",
};

const OPPORTUNITY_LINES: Record<CategoryKey, string> = {
  technology: "Let's build your tech confidence first. A few short lessons will make phones and computers feel a lot less intimidating.",
  support: "Let's start by strengthening your support network. Nobody does reentry alone, and you shouldn't have to.",
  employment: "Let's work on how you talk about your past with employers. It is a skill, and skills can be practiced.",
  hope: "Let's build some momentum. Every small win adds up, and you'll hear from people who walked this path.",
  resources: "Let's make sure you know exactly where to turn. Having a plan ahead of time takes a lot of stress away.",
};

export function greeting(firstName: string, date = new Date()): string {
  const h = date.getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${part}, ${firstName}`;
}

export function resultsMessage(firstName: string, result: AssessmentResult): string {
  return `${firstName}, thank you for being honest. ${STRENGTH_LINES[result.topStrength]} ${OPPORTUNITY_LINES[result.topOpportunity]}`;
}

export function homeMessage(opts: {
  firstName: string;
  lessonsDone: number;
  totalLessons: number;
  streak: number;
  latest: AssessmentResult | null;
}): string {
  const { firstName, lessonsDone, totalLessons, streak, latest } = opts;
  if (!latest) return `Hi ${firstName}! Start with a quick 10-question check-in so I can build a path just for you.`;
  if (lessonsDone === 0)
    return `Your path is ready, ${firstName}. Your first mission takes about five minutes. Let's go.`;
  if (lessonsDone === totalLessons)
    return `You finished every lesson, ${firstName}. That took real commitment. Retake your check-in to see how far you've come.`;
  if (streak >= 3) return `${streak} days in a row! You're building a habit, ${firstName}. Keep it rolling.`;
  if (lessonsDone >= totalLessons / 2)
    return `You're more than halfway there, ${firstName}. Look at what you've already done.`;
  return `Welcome back, ${firstName}. Every lesson you finish is proof you're getting ready.`;
}

export function improvementMessage(first: AssessmentResult, latest: AssessmentResult): string {
  const diff = latest.overall - first.overall;
  if (diff > 0) {
    const gains = (Object.keys(latest.scores) as CategoryKey[])
      .map((k) => ({ k, d: latest.scores[k] - first.scores[k] }))
      .sort((a, b) => b.d - a.d);
    const best = gains[0];
    return `Your readiness is up ${diff} points since your first check-in. Biggest growth: ${CATEGORY_META[best.k].label} (+${best.d}).`;
  }
  if (diff === 0) return "Your score held steady. Progress isn't always a straight line — keep going.";
  return "Your score dipped a little. That's okay — being more honest about challenges is a kind of progress too.";
}

export const LESSON_CHEERS = [
  "You did it! One more step forward.",
  "Look at you go! That's real progress.",
  "Nice work. Your future self says thank you.",
  "Another lesson done. You're building something real.",
  "Great job! Every step counts.",
];
