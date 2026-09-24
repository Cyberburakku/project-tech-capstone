import { createContext, useContext } from "react";
import type { Theme } from "@/lib/theme";

export type SheetName = "help" | "settings";

export interface ShellState {
  openSheet: (name: SheetName) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** "Pause animations": freezes CSS, Framer Motion and the hero shader. */
  still: boolean;
  setStill: (still: boolean) => void;
}

export const ShellContext = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used inside AppShell");
  return ctx;
}
