import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { exitDemo, isDemo } from "@/lib/demo";

/** Thin strip shown while the sample learner is loaded. */
export function DemoBanner() {
  const navigate = useNavigate();
  // Re-render when the profile changes (demo loaded or cleared).
  useAppStore((s) => s.profile?.id);
  if (!isDemo()) return null;
  return (
    <div className="mx-4 mt-1 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-2 text-sm text-paper web:mx-10 dark:border dark:border-line dark:bg-card dark:text-ink">
      <span className="flex min-w-0 items-center gap-2 font-semibold">
        <PlayCircle aria-hidden className="size-4 shrink-0 text-sun" />
        <span className="truncate">Demo mode · sample learner</span>
      </span>
      <button
        type="button"
        onClick={() => {
          exitDemo();
          navigate("/");
        }}
        className="min-h-9 shrink-0 rounded-full px-2 font-bold text-sun underline underline-offset-4"
      >
        Exit demo
      </button>
    </div>
  );
}
