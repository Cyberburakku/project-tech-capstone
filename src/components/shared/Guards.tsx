import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

/** Requires a profile (first name + county). */
export function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return <Navigate to="/start" replace />;
  return <>{children}</>;
}

/** Requires a profile and at least one completed assessment. */
export function RequireAssessment({ children }: { children: React.ReactNode }) {
  const profile = useAppStore((s) => s.profile);
  const hasAssessment = useAppStore((s) => s.assessments.length > 0);
  if (!profile) return <Navigate to="/start" replace />;
  if (!hasAssessment) return <Navigate to="/assessment" replace />;
  return <>{children}</>;
}
