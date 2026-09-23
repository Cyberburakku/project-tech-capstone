import { describe, expect, it } from "vitest";
import { buildPath, currentLesson, isLessonUnlocked, learningStreak } from "@/lib/progress";
import { allLessons } from "@/data/modules";
import { mentorStories } from "@/data/mentors";
import { affirmations } from "@/data/affirmations";

describe("learning path", () => {
  it("unlocks exactly one lesson at a time", () => {
    const path = buildPath(null, {});
    expect(path.filter((p) => p.status === "current")).toHaveLength(1);
    expect(path[0].status).toBe("current");
    expect(path.slice(1).every((p) => p.status === "locked")).toBe(true);
  });

  it("moves to the next lesson after completion", () => {
    const first = buildPath(null, {})[0].lesson.id;
    const path = buildPath(null, { [first]: { completedAt: new Date().toISOString() } });
    expect(isLessonUnlocked(path, first)).toBe(true);
    expect(currentLesson(path)?.index).toBe(1);
  });

  it("counts consecutive-day streaks", () => {
    const today = new Date("2026-09-23T12:00:00");
    const day = (d: number) => new Date(today.getTime() - d * 86400000).toISOString();
    expect(learningStreak({ a: { completedAt: day(0) }, b: { completedAt: day(1) }, c: { completedAt: day(3) } }, today)).toBe(2);
  });
});

describe("content", () => {
  it("has 13 lessons with lesson, activity, reflection and a valid mentor story", () => {
    expect(allLessons).toHaveLength(13);
    const ids = new Set(mentorStories.map((m) => m.id));
    for (const l of allLessons) {
      expect(l.blocks.length).toBeGreaterThan(0);
      expect(l.activity).toBeTruthy();
      expect(l.reflection.prompt).toBeTruthy();
      expect(ids.has(l.mentorStoryId)).toBe(true);
    }
  });

  it("has 20 mentor stories and 20 affirmations", () => {
    expect(mentorStories).toHaveLength(20);
    expect(affirmations).toHaveLength(20);
  });
});
