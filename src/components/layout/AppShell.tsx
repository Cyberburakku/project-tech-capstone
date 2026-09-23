import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Header, MobileNav } from "@/components/layout/Header";
import { AffirmationTicker } from "@/components/layout/AffirmationTicker";
import { CrisisBar } from "@/components/layout/CrisisBar";
import { useAppStore } from "@/store/useAppStore";

export function AppShell() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const flush = useAppStore((s) => s.flush);

  // Retry any unsynced progress on load and when the connection comes back.
  useEffect(() => {
    void flush();
    const onOnline = () => void flush();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [flush]);

  // Move focus to main content on route change for screen reader users.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only-focusable rounded-xl bg-ink px-4 py-3 font-semibold text-cream">
        Skip to main content
      </a>
      <Header />
      <AffirmationTicker />
      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 pb-40 outline-none md:pb-24"
      >
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
      <MobileNav />
      <CrisisBar />
    </div>
  );
}
