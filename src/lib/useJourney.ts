import { useMemo } from "react";
import { useAppStore, selectLatestAssessment } from "@/store/useAppStore";
import { buildPath, currentLesson } from "@/lib/progress";
import { buildJourney, readSeenResources } from "@/lib/journey";

/** The learner's five-step journey, from the store plus the device-only resources flag. */
export function useJourney() {
  const latest = useAppStore(selectLatestAssessment);
  const completed = useAppStore((s) => s.completedLessons);
  return useMemo(() => {
    const mission = currentLesson(buildPath(latest, completed));
    return buildJourney({
      hasAssessment: Boolean(latest),
      completed,
      seenResources: readSeenResources(),
      missionTo: mission ? `/lesson/${mission.lesson.id}` : "/path",
    });
  }, [latest, completed]);
}
