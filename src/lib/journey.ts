import { modules } from "@/data/modules";
import type { LessonCompletion } from "@/store/useAppStore";

/** Device-only flag: the learner has opened their resource matches at least once. */
export const SEEN_RESOURCES_KEY = "project-tech:seen-resources";

export function readSeenResources(): boolean {
  try {
    return localStorage.getItem(SEEN_RESOURCES_KEY) === "true";
  } catch {
    return false;
  }
}

export function markSeenResources() {
  try {
    localStorage.setItem(SEEN_RESOURCES_KEY, "true");
  } catch {
    // Storage blocked — the step just stays open.
  }
}

export type JourneyKey = "checkin" | "mission" | "path" | "resources" | "certificate";

export interface JourneyStep {
  key: JourneyKey;
  label: string;
  to: string;
  done: boolean;
}

/**
 * The five-step journey: Check-in → Today's Mission → My Path → Resources → Certificate.
 * Each step is done or not on its own; the first open step is "current".
 */
export function buildJourney(opts: {
  hasAssessment: boolean;
  completed: Record<string, LessonCompletion>;
  seenResources: boolean;
  missionTo: string;
}): { steps: JourneyStep[]; doneCount: number; current: JourneyStep | null } {
  const { hasAssessment, completed, seenResources, missionTo } = opts;
  const lessonsDone = Object.keys(completed).length;
  const finishedModule = modules.find((m) => m.lessons.every((l) => completed[l.id]));
  const steps: JourneyStep[] = [
    { key: "checkin", label: "Check-In", to: hasAssessment ? "/results" : "/assessment", done: hasAssessment },
    { key: "mission", label: "Today's Mission", to: missionTo, done: lessonsDone > 0 },
    { key: "path", label: "My Path", to: "/path", done: lessonsDone >= 3 },
    { key: "resources", label: "Resources", to: "/resources", done: seenResources },
    {
      key: "certificate",
      label: "Certificate",
      to: finishedModule ? `/certificate/${finishedModule.id}` : "/progress",
      done: Boolean(finishedModule),
    },
  ];
  return {
    steps,
    doneCount: steps.filter((s) => s.done).length,
    current: steps.find((s) => !s.done) ?? null,
  };
}
