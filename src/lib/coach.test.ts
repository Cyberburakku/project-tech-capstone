import { describe, expect, it } from "vitest";
import { greeting, homeMessage } from "@/lib/coach";
import { scoreAssessment } from "@/lib/scoring";
import { assessmentQuestions } from "@/data/assessment";

const at = (h: number, m = 0) => new Date(2026, 8, 25, h, m);
const latest = scoreAssessment(Object.fromEntries(assessmentQuestions.map((q) => [q.id, q.options[0].id])));

describe("time-of-day greeting", () => {
  it("uses device local time", () => {
    expect(greeting("Jordan", at(11, 59))).toBe("Good morning, Jordan");
    expect(greeting("Jordan", at(12, 0))).toBe("Good afternoon, Jordan");
    expect(greeting("Jordan", at(16, 59))).toBe("Good afternoon, Jordan");
    expect(greeting("Jordan", at(17, 0))).toBe("Good evening, Jordan");
  });
});

describe("re-engagement nudges", () => {
  it("never mention a day count", () => {
    const streak = homeMessage({ firstName: "Jordan", lessonsDone: 2, totalLessons: 13, streak: 5, latest });
    const returning = homeMessage({ firstName: "Jordan", lessonsDone: 2, totalLessons: 13, streak: 0, latest });
    expect(streak).toBe("Your path is still here whenever you're ready.");
    expect(returning).toBe("Missed you. Come pick up where you left off.");
    for (const msg of [streak, returning]) expect(msg).not.toMatch(/\d|days?|streak/i);
  });
});
