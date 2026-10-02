import { getModule } from "@/data/modules";
import { scoreAssessment } from "@/lib/scoring";
import { SEEN_RESOURCES_KEY } from "@/lib/journey";
import { useAppStore, type LessonCompletion } from "@/store/useAppStore";
import { uuid } from "@/lib/utils";

/** Device-only flag that the current data is the sample learner. */
export const DEMO_KEY = "project-tech:demo";

/**
 * Sample check-in answers (fictional). They land on:
 * Technology Comfort 23 (Just Getting Started), Support Network 48 (Building Momentum),
 * Employment Confidence 63 (Making Real Progress); first need: finding work.
 */
const DEMO_ANSWERS = {
  q1: "not",
  q2: "phone",
  q3: "unsure",
  q4: "monthly",
  q5: "somewhat",
  q6: "somewhat",
  q7: "work",
  q8: "skills",
  q9: "not-sure",
  q10: "employment",
};

export function isDemo(): boolean {
  try {
    return localStorage.getItem(DEMO_KEY) === "true";
  } catch {
    return false;
  }
}

/** Replace this device's data with the sample learner, part-way through the journey. */
export function loadDemo() {
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const assessment = scoreAssessment(DEMO_ANSWERS, new Date(now - 4 * day));
  // Technology is the top focus, so its five lessons come first. All done → certificate earned.
  const tech = getModule("technology")!;
  const completedLessons: Record<string, LessonCompletion> = {};
  tech.lessons.forEach((l, i) => {
    const daysAgo = Math.max(0, 3 - Math.floor(i * 0.75));
    completedLessons[l.id] = { completedAt: new Date(now - daysAgo * day).toISOString() };
  });
  const firstTwo = tech.lessons.slice(0, 2).map((l) => l.id);

  useAppStore.setState({
    profile: { id: uuid(), firstName: "Jordan", county: "Cumberland", createdAt: new Date(now - 4 * day).toISOString() },
    draftAnswers: {},
    assessments: [assessment],
    completedLessons,
    reflections: {
      [firstTwo[0]]: { text: "I set up a lock screen code today. It felt good to know my phone is safe.", savedAt: new Date(now - 3 * day).toISOString() },
      [firstTwo[1]]: { text: "Using the mouse got easier after a few tries.", savedAt: new Date(now - 2 * day).toISOString() },
    },
    builderAnswers: {},
    checklistState: {},
    certificates: { technology: { code: "TECH-DEMO2026", issuedAt: new Date(now - day).toISOString() } },
    syncQueue: [],
  });
  try {
    localStorage.setItem(DEMO_KEY, "true");
    localStorage.setItem(SEEN_RESOURCES_KEY, "true");
  } catch {
    // Storage blocked — the demo still works for this visit.
  }
}

/** Clear the sample learner and start fresh. */
export function exitDemo() {
  useAppStore.getState().resetAll();
  try {
    localStorage.removeItem(DEMO_KEY);
    localStorage.removeItem(SEEN_RESOURCES_KEY);
  } catch {
    // ignore
  }
}
