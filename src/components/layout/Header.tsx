import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { useShell } from "@/components/layout/ShellContext";
import { cn } from "@/lib/utils";

/**
 * 64px sticky header. Transparent over the hero sky, then blurs with a
 * hairline once the page scrolls (scrollY ≥ 8).
 */
export function Header() {
  const { openSheet } = useShell();
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-3 pl-6 pr-4 transition-[background-color,box-shadow] duration-300 max-[374px]:gap-2 max-[374px]:pl-[18px] max-[374px]:pr-2.5",
        "web:px-10",
        atTop
          ? "bg-transparent"
          : "bg-paper/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md backdrop-saturate-150",
      )}
    >
      <Logo />

      <nav aria-label="Main" className="hidden web:block">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "relative flex min-h-11 items-center rounded-xl px-3.5 text-base font-bold text-ink-2 hover:text-ink",
                    isActive &&
                      "text-ink after:absolute after:inset-x-3.5 after:bottom-1.5 after:h-[3px] after:rounded-full after:bg-clay after:content-['']",
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => openSheet("help")}
        aria-haspopup="dialog"
        className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink pl-3 pr-4 text-[15px] font-bold text-paper max-[374px]:pl-2.5 max-[374px]:pr-3 web:ml-2"
      >
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-sun shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-sun)_35%,transparent)]"
        />
        Help now
      </button>
      <button
        type="button"
        onClick={() => openSheet("settings")}
        aria-label="Settings"
        aria-haspopup="dialog"
        className="grid size-11 shrink-0 place-items-center rounded-xl text-ink hover:bg-paper-2"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>
    </header>
  );
}
