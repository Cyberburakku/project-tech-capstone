import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getInitialTheme, hasSavedTheme, saveTheme, type Theme } from "@/lib/theme";

/** Light / dark switch. Follows the device setting until the learner chooses. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Keep following the device setting if the learner hasn't picked a theme.
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const onChange = (e: MediaQueryListEvent) => {
      if (!hasSavedTheme()) setTheme(e.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isDark = theme === "dark";
  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    saveTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex size-11 items-center justify-center rounded-full border-2 border-line bg-card text-ink transition-colors hover:border-primary hover:bg-primary-soft"
    >
      {isDark ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
    </button>
  );
}
