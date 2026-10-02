import { beforeEach, describe, expect, it } from "vitest";
import { buildJourney } from "@/lib/journey";
import { scoreBand } from "@/lib/scoring";
import { loadDemo } from "@/lib/demo";
import { useAppStore } from "@/store/useAppStore";
import { getModule } from "@/data/modules";

describe("buildJourney", () => {
  it("starts at the check-in", () => {
    const j = buildJourney({ hasAssessment: false, completed: {}, seenResources: false, missionTo: "/path" });
    expect(j.doneCount).toBe(0);
    expect(j.current?.key).toBe("checkin");
  });

  it("marks the certificate step once a module is finished", () => {
    const completed = Object.fromEntries(
      getModule("technology")!.lessons.map((l) => [l.id, { completedAt: new Date().toISOString() }]),
    );
    const j = buildJourney({ hasAssessment: true, completed, seenResources: true, missionTo: "/path" });
    expect(j.doneCount).toBe(5);
    expect(j.current).toBeNull();
    expect(j.steps[4].to).toBe("/certificate/technology");
  });
});

describe("demo mode", () => {
  beforeEach(() => useAppStore.getState().resetAll());

  it("loads the sample learner with the planned starting points", () => {
    loadDemo();
    const s = useAppStore.getState();
    const a = s.assessments[0];
    expect(s.profile?.firstName).toBe("Jordan");
    expect(scoreBand(a.scores.technology).label).toBe("Just Getting Started");
    expect(scoreBand(a.scores.support).label).toBe("Building Momentum");
    expect(scoreBand(a.scores.employment).label).toBe("Making Real Progress");
    expect(a.needTags[0]).toBe("employment");
    expect(Object.keys(s.completedLessons)).toHaveLength(5);
  });
});
