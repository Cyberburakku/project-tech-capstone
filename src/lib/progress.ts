import { modules, getModule } from "@/data/modules";
import { orderModules } from "@/lib/scoring";
import type { AssessmentResult, Lesson, LearningModule, ModuleId } from "@/types";
import type { LessonCompletion } from "@/store/useAppStore";

export type LessonStatus = "completed" | "current" | "locked";

export interface PathLesson {
  lesson: Lesson;
  module: LearningModule;
  status: LessonStatus;
  /** 0-based position in the whole path */
  index: number;
}

const DEFAULT_ORDER: ModuleId[] = ["technology", "support-network", "talking-about-your-record"];

export function moduleOrder(assessment: AssessmentResult | null): ModuleId[] {
  return assessment ? orderModules(assessment.scores) : DEFAULT_ORDER;
}

/**
 * Build the Duolingo-style path. Progressive disclosure: exactly one lesson is
 * "current" (the first one not yet completed); everything after it is locked.
 */
export function buildPath(
  assessment: AssessmentResult | null,
  completed: Record<string, LessonCompletion>,
): PathLesson[] {
  const path: PathLesson[] = [];
  let currentAssigned = false;
  let index = 0;
  for (const moduleId of moduleOrder(assessment)) {
    const module = getModule(moduleId)!;
    for (const lesson of module.lessons) {
      let status: LessonStatus;
      if (completed[lesson.id]) status = "completed";
      else if (!currentAssigned) {
        status = "current";
        currentAssigned = true;
      } else status = "locked";
      path.push({ lesson, module, status, index: index++ });
    }
  }
  return path;
}

export function currentLesson(path: PathLesson[]): PathLesson | null {
  return path.find((p) => p.status === "current") ?? null;
}

export function isLessonUnlocked(path: PathLesson[], lessonId: string): boolean {
  const entry = path.find((p) => p.lesson.id === lessonId);
  return Boolean(entry && entry.status !== "locked");
}

export function moduleProgress(moduleId: ModuleId, completed: Record<string, LessonCompletion>) {
  const module = getModule(moduleId)!;
  const done = module.lessons.filter((l) => completed[l.id]).length;
  return {
    done,
    total: module.lessons.length,
    percent: Math.round((done / module.lessons.length) * 100),
    isComplete: done === module.lessons.length,
  };
}

export function overallProgress(completed: Record<string, LessonCompletion>) {
  const total = modules.reduce((n, m) => n + m.lessons.length, 0);
  const done = modules.reduce((n, m) => n + m.lessons.filter((l) => completed[l.id]).length, 0);
  return { done, total, percent: Math.round((done / total) * 100) };
}

/** Consecutive days (ending today or yesterday) with at least one completed lesson. */
export function learningStreak(completed: Record<string, LessonCompletion>, today = new Date()): number {
  const days = new Set(
    Object.values(completed).map((c) => new Date(c.completedAt).toDateString()),
  );
  const cursor = new Date(today);
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
