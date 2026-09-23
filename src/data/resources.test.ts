import { describe, it, expect } from "vitest";
import type { ScoreSet } from "@/types";
import { getResource, MAINE_COUNTIES, matchResources, resources } from "./resources";

const midScores: ScoreSet = {
  technology: 50,
  support: 50,
  employment: 50,
  hope: 50,
  resources: 50,
};

describe("resources database", () => {
  it("has 10 resources with unique ids and 16 counties", () => {
    expect(resources).toHaveLength(10);
    expect(new Set(resources.map((r) => r.id)).size).toBe(10);
    expect(MAINE_COUNTIES).toHaveLength(16);
  });

  it("looks up a resource by id", () => {
    expect(getResource("211-maine")?.name).toBe("211 Maine");
    expect(getResource("nope")).toBeUndefined();
  });
});

describe("matchResources", () => {
  it("returns exactly 3 results by default", () => {
    const result = matchResources({ scores: midScores, county: "Kennebec", needTags: [] });
    expect(result).toHaveLength(3);
    result.forEach((m) => expect(m.reason.length).toBeGreaterThan(0));
  });

  it("puts MaineHousing or 211 Maine in the top 3 for a housing need", () => {
    const result = matchResources({
      scores: midScores,
      county: "Cumberland",
      needTags: ["housing"],
    });
    const ids = result.map((m) => m.resource.id);
    expect(ids.some((id) => id === "mainehousing" || id === "211-maine")).toBe(true);
    expect(result[0].reason).toMatch(/housing is your first need/);
  });

  it("surfaces Pine Tree Legal for a legal need", () => {
    const result = matchResources({
      scores: { technology: 30, support: 30, employment: 30, hope: 30, resources: 30 },
      county: "Penobscot",
      needTags: ["legal"],
    });
    expect(result.map((m) => m.resource.id)).toContain("pine-tree-legal");
  });

  it("is deterministic", () => {
    const input = {
      scores: { technology: 20, support: 70, employment: 40, hope: 60, resources: 35 },
      county: "York",
      needTags: ["employment", "recovery"] as const,
    };
    const a = matchResources({ ...input, needTags: [...input.needTags] });
    const b = matchResources({ ...input, needTags: [...input.needTags] });
    expect(a).toEqual(b);
  });

  it("only boosts women-focused resources when requested", () => {
    const without = matchResources(
      { scores: midScores, county: "York", needTags: ["support"] },
      10,
    );
    const withWomen = matchResources(
      { scores: midScores, county: "York", needTags: ["women", "support"] },
      10,
    );
    const rank = (list: typeof without) =>
      list.findIndex((m) => m.resource.id === "reentry-sisters");
    expect(rank(withWomen)).toBeLessThan(rank(without));
    expect(withWomen[0].resource.id).toBe("reentry-sisters");
  });
});
