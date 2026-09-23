import { supabase } from "@/lib/supabase";
import { modules } from "@/data/modules";
import type { CategoryKey, ModuleId, ScoreSet } from "@/types";
import type { useAppStore } from "@/store/useAppStore";

export interface AdminStats {
  source: "supabase" | "device";
  total_learners: number;
  total_assessments: number;
  average_overall: number;
  average_by_category: ScoreSet;
  average_improvement: number;
  lessons_completed: number;
  reflections_written: number;
  certificates_issued: number;
  modules: { module_id: ModuleId; learners_started: number; learners_completed: number; lessons_done: number }[];
  top_opportunities: Partial<Record<CategoryKey, number>>;
  top_resources: { resource_id: string; count: number }[];
}

type StoreState = ReturnType<typeof useAppStore.getState>;

/** Aggregate stats from Supabase (via the PII-free admin_stats() function). */
export async function fetchAdminStats(): Promise<AdminStats | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("admin_stats");
  if (error || !data) throw new Error(error?.message ?? "No data");
  return { ...(data as Omit<AdminStats, "source">), source: "supabase" };
}

/** Fallback when Supabase isn't configured: stats for this device only. */
export function deviceStats(s: StoreState): AdminStats {
  const latest = s.assessments[s.assessments.length - 1];
  const first = s.assessments[0];
  const empty: ScoreSet = { technology: 0, support: 0, employment: 0, hope: 0, resources: 0 };
  return {
    source: "device",
    total_learners: s.profile ? 1 : 0,
    total_assessments: s.assessments.length,
    average_overall: latest?.overall ?? 0,
    average_by_category: latest?.scores ?? empty,
    average_improvement: latest && first && latest !== first ? latest.overall - first.overall : 0,
    lessons_completed: Object.keys(s.completedLessons).length,
    reflections_written: Object.keys(s.reflections).length,
    certificates_issued: Object.keys(s.certificates).length,
    modules: modules.map((m) => {
      const done = m.lessons.filter((l) => s.completedLessons[l.id]).length;
      return {
        module_id: m.id,
        learners_started: done > 0 ? 1 : 0,
        learners_completed: done === m.lessons.length ? 1 : 0,
        lessons_done: done,
      };
    }),
    top_opportunities: latest ? { [latest.topOpportunity]: 1 } : {},
    top_resources: [],
  };
}
