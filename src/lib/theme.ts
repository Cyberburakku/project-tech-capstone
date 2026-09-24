export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "project-tech:theme";

const THEME_COLORS: Record<Theme, string> = { light: "#FBF6EE", dark: "#141B1D" };

/** Saved choice, or the device setting when the learner hasn't picked one. */
export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage blocked (private mode) — fall back to the device setting.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function hasSavedTheme(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore — the theme still applies for this visit.
  }
}
