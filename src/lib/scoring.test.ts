import { describe, expect, it } from "vitest";
import { assessmentQuestions } from "@/data/assessment";
import {
  collectNeedTags,
  computeScores,
  isComplete,
  orderModules,
  overallScore,
  scoreAssessment,
  topOpportunity,
  topStrength,
} from "@/lib/scoring";
import type { AssessmentAnswers } from "@/types";

const allFirst: AssessmentAnswers = Object.fromEntries(
  assessmentQuestions.map((q) => [q.id, q.options[0].id]),
);

describe("assessment", () => {
  it("has exactly 10 questions, 2 per category", () => {
    expect(assessmentQuestions).toHaveLength(10);
    const counts: Record<string, number> = {};
    for (const q of assessmentQuestions) counts[q.category] = (counts[q.category] ?? 0) + 1;
    expect(Object.values(counts)).toEqual([2, 2, 2, 2, 2]);
  });
});

describe("scoring engine", () => {
  it("scores stay within 0–100", () => {
    const scores = computeScores(allFirst);
    for (const v of Object.values(scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
    expect(overallScore(scores)).toBeGreaterThanOrEqual(0);
  });

  it("averages the two answers in a category", () => {
    const answers = { ...allFirst, q1: "very", q2: "phone" }; // 100 + 35
    expect(computeScores(answers).technology).toBe(68);
  });

  it("finds strength and opportunity", () => {
    const answers = { ...allFirst, q3: "none", q4: "never" };
    const scores = computeScores(answers);
    expect(topOpportunity(scores)).toBe("support");
    expect(topStrength(scores)).not.toBe("support");
  });

  it("puts the Q10 need first in the need tags", () => {
    const answers = { ...allFirst, q7: "housing", q10: "legal" };
    expect(collectNeedTags(answers)[0]).toBe("legal");
    expect(collectNeedTags(answers)).toContain("housing");
  });

  it("detects incomplete answers", () => {
    const { q5: _omit, ...partial } = allFirst;
    void _omit;
    expect(isComplete(partial)).toBe(false);
    expect(isComplete(allFirst)).toBe(true);
  });

  it("orders modules with the top opportunity first", () => {
    const low = { ...allFirst, q5: "not", q6: "avoid" };
    expect(orderModules(computeScores(low))[0]).toBe("talking-about-your-record");
    const lowTech = { ...allFirst, q1: "not", q2: "phone" };
    expect(orderModules(computeScores(lowTech))[0]).toBe("technology");
  });

  it("builds a full result", () => {
    const r = scoreAssessment(allFirst);
    expect(r.id).toBeTruthy();
    expect(r.overall).toBe(overallScore(r.scores));
  });
});
