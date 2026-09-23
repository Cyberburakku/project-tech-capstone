import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAssessment, RequireProfile } from "@/components/shared/Guards";
import HomePage from "@/pages/HomePage";

const StartPage = lazy(() => import("@/pages/StartPage"));
const AssessmentPage = lazy(() => import("@/pages/AssessmentPage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const PathPage = lazy(() => import("@/pages/PathPage"));
const LessonPage = lazy(() => import("@/pages/LessonPage"));
const ResourcesPage = lazy(() => import("@/pages/ResourcesPage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const CertificatePage = lazy(() => import("@/pages/CertificatePage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <span className="size-10 animate-spin rounded-full border-4 border-primary-soft border-t-primary-dark" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

const s = (el: React.ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/start", element: s(<StartPage />) },
      { path: "/privacy", element: s(<PrivacyPage />) },
      { path: "/assessment", element: s(<RequireProfile><AssessmentPage /></RequireProfile>) },
      { path: "/results", element: s(<RequireAssessment><ResultsPage /></RequireAssessment>) },
      { path: "/path", element: s(<RequireAssessment><PathPage /></RequireAssessment>) },
      { path: "/lesson/:lessonId", element: s(<RequireAssessment><LessonPage /></RequireAssessment>) },
      { path: "/resources", element: s(<RequireAssessment><ResourcesPage /></RequireAssessment>) },
      { path: "/progress", element: s(<RequireAssessment><ProgressPage /></RequireAssessment>) },
      { path: "/certificate/:moduleId", element: s(<RequireAssessment><CertificatePage /></RequireAssessment>) },
      // Hidden demo route — intentionally not linked anywhere in the UI.
      { path: "/admin-demo", element: s(<AdminPage />) },
      { path: "*", element: s(<NotFoundPage />) },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
