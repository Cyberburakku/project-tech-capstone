import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { HelpSheet } from "@/components/layout/HelpSheet";
import { SettingsSheet } from "@/components/layout/SettingsSheet";
import { ShellContext, type SheetName, type ShellState } from "@/components/layout/ShellContext";
import { useAppStore } from "@/store/useAppStore";
import { applyTheme, getInitialTheme, saveTheme, type Theme } from "@/lib/theme";
import { getInitialStill, saveStill } from "@/lib/motion";
import { readAvatarId, saveAvatarId } from "@/components/shared/avatars";

export function AppShell() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const flush = useAppStore((s) => s.flush);

  const [sheet, setSheet] = useState<SheetName | null>(null);
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [still, setStillState] = useState<boolean>(getInitialStill);
  const [avatarId, setAvatarIdState] = useState<string | null>(readAvatarId);

  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("still", still);
  }, [still]);

  const setTheme = useCallback((t: Theme) => {
    saveTheme(t);
    setThemeState(t);
  }, []);
  const setStill = useCallback((v: boolean) => {
    saveStill(v);
    setStillState(v);
  }, []);
  const setAvatarId = useCallback((id: string) => {
    saveAvatarId(id);
    setAvatarIdState(id);
  }, []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const shell = useMemo<ShellState>(
    () => ({ openSheet: setSheet, theme, setTheme, still, setStill, avatarId, setAvatarId }),
    [theme, setTheme, still, setStill, avatarId, setAvatarId],
  );

  // Retry any unsynced progress on load and when the connection comes back.
  useEffect(() => {
    void flush();
    const onOnline = () => void flush();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [flush]);

  // On route change: back to the top, focus main for screen reader users, close sheets.
  useEffect(() => {
    setSheet(null);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <ShellContext.Provider value={shell}>
      <MotionConfig reducedMotion={still ? "always" : "user"}>
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper web:max-w-none">
          <a
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              mainRef.current?.focus();
            }}
            className="sr-only-focusable rounded-xl bg-ink px-3.5 py-2.5 font-bold text-paper"
          >
            Skip to main content
          </a>
          <Header />
          <DemoBanner />
          <main
            id="main"
            ref={mainRef}
            tabIndex={-1}
            className="flex-1 pb-[calc(110px+env(safe-area-inset-bottom))] outline-none web:pb-20"
          >
            <Outlet />
          </main>
          <TabBar />
        </div>
        <HelpSheet open={sheet === "help"} onClose={closeSheet} />
        <SettingsSheet open={sheet === "settings"} onClose={closeSheet} />
      </MotionConfig>
    </ShellContext.Provider>
  );
}
