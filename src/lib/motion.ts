export const STILL_STORAGE_KEY = "project-tech:still";

/** Saved "Pause animations" choice, else the OS reduced-motion setting. */
export function getInitialStill(): boolean {
  try {
    const saved = localStorage.getItem(STILL_STORAGE_KEY);
    if (saved === "true" || saved === "false") return saved === "true";
  } catch {
    // Storage blocked — fall through to the OS setting.
  }
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function saveStill(still: boolean) {
  try {
    localStorage.setItem(STILL_STORAGE_KEY, String(still));
  } catch {
    // Ignore — the choice still applies for this visit.
  }
}
