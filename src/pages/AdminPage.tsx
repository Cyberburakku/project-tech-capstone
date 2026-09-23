import { useEffect, useState } from "react";
import { AlertTriangle, Award, BarChart3, BookOpen, Database, PenLine, RefreshCw, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { RadialScore } from "@/components/shared/RadialScore";
import { useAppStore } from "@/store/useAppStore";
import { fetchAdminStats, deviceStats, type AdminStats } from "@/lib/adminStats";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getModule } from "@/data/modules";
import { getResource } from "@/data/resources";
import { CATEGORY_META, CATEGORY_ORDER } from "@/data/assessment";

/** Hidden demo dashboard (/admin-demo). Aggregates only — no PII is ever shown. */
export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const remote = isSupabaseConfigured ? await fetchAdminStats() : null;
      setStats(remote ?? deviceStats(useAppStore.getState()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load stats");
      setStats(deviceStats(useAppStore.getState()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.head.insertAdjacentHTML("beforeend", '<meta name="robots" content="noindex" id="admin-noindex">');
    void load();
    return () => document.getElementById("admin-noindex")?.remove();
  }, []);

  return (
    <div className="container-app">
      <PageHeader
        eyebrow="Demo only"
        title="Program dashboard"
        description="Aggregate numbers only. No names, counties, or individual answers are shown here."
      >
        <Button variant="secondary" onClick={load} disabled={loading}>
          <RefreshCw aria-hidden className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </PageHeader>

      {stats && (
        <p className="mb-4 flex items-center gap-2 text-sm text-ink-soft">
          <Database aria-hidden className="size-4" />
          {stats.source === "supabase" ? (
            <Badge>Live · Supabase</Badge>
          ) : (
            <Badge variant="achievement">This device only — connect Supabase for program-wide numbers</Badge>
          )}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 flex items-center gap-2 rounded-2xl bg-action-soft p-3 text-sm text-ink">
          <AlertTriangle aria-hidden className="size-4 text-action-dark" /> Couldn't reach Supabase ({error}). Showing device data.
        </p>
      )}

      {stats && (
        <>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { icon: BarChart3, label: "Total Assessments", value: stats.total_assessments },
              { icon: Users, label: "Learners", value: stats.total_learners },
              { icon: BookOpen, label: "Lessons completed", value: stats.lessons_completed },
              { icon: PenLine, label: "Reflections", value: stats.reflections_written },
              { icon: Award, label: "Certificates", value: stats.certificates_issued },
              {
                icon: TrendingUp,
                label: "Avg. readiness change",
                value: `${stats.average_improvement > 0 ? "+" : ""}${stats.average_improvement}`,
              },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label}>
                <Card className="h-full">
                  <CardContent className="p-5">
                    <Icon aria-hidden className="size-6 text-primary-dark" />
                    <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
                    <p className="text-sm text-ink-soft">{label}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Average Readiness Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
                <RadialScore value={stats.average_overall} size={150} label="Average readiness score" sublabel="Average" />
                <ul className="w-full space-y-3">
                  {CATEGORY_ORDER.map((k) => (
                    <li key={k}>
                      <div className="flex justify-between text-sm font-semibold text-ink">
                        <span>{CATEGORY_META[k].label}</span>
                        <span>{stats.average_by_category[k]}</span>
                      </div>
                      <div className="mt-1 h-2.5 rounded-full bg-muted" aria-hidden>
                        <div className="h-full rounded-full" style={{ width: `${stats.average_by_category[k]}%`, background: CATEGORY_META[k].hex }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Learners who started and completed each module</caption>
                  <thead>
                    <tr className="text-ink-soft">
                      <th scope="col" className="py-2">Module</th>
                      <th scope="col" className="py-2 text-right">Started</th>
                      <th scope="col" className="py-2 text-right">Completed</th>
                      <th scope="col" className="py-2 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.modules.map((m) => {
                      const rate = m.learners_started ? Math.round((m.learners_completed / m.learners_started) * 100) : 0;
                      return (
                        <tr key={m.module_id} className="border-t border-line">
                          <th scope="row" className="py-3 font-semibold text-ink">{getModule(m.module_id)?.title ?? m.module_id}</th>
                          <td className="py-3 text-right text-ink">{m.learners_started}</td>
                          <td className="py-3 text-right text-ink">{m.learners_completed}</td>
                          <td className="py-3 text-right font-bold text-primary-dark">{rate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <h3 className="mt-6 text-sm font-bold text-ink">Most common top opportunity</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(stats.top_opportunities)
                    .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                    .map(([k, n]) => (
                      <li key={k}>
                        <Badge variant="muted">
                          {CATEGORY_META[k as keyof typeof CATEGORY_META]?.label ?? k}: {n}
                        </Badge>
                      </li>
                    ))}
                </ul>
                {stats.top_resources.length > 0 && (
                  <>
                    <h3 className="mt-6 text-sm font-bold text-ink">Most recommended resources</h3>
                    <ol className="mt-2 space-y-1 text-sm text-ink">
                      {stats.top_resources.map((r) => (
                        <li key={r.resource_id}>
                          {getResource(r.resource_id)?.name ?? r.resource_id} — {r.count}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
