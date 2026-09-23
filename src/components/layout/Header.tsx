import { NavLink } from "react-router-dom";
import { Home, Map, LifeBuoy, BarChart3 } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/path", label: "My Path", icon: Map, end: false },
  { to: "/resources", label: "Resources", icon: LifeBuoy, end: false },
  { to: "/progress", label: "Progress", icon: BarChart3, end: false },
];

export function Header() {
  const profile = useAppStore((s) => s.profile);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/75">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-ink-soft hover:bg-muted hover:text-ink",
                      isActive && "bg-primary-soft text-primary-dark",
                    )
                  }
                >
                  <Icon aria-hidden className="size-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {profile && (
            <div
              className="flex size-10 items-center justify-center rounded-full bg-achievement text-base font-bold text-on-bright md:size-11"
              aria-label={`Signed in as ${profile.firstName}`}
              role="img"
            >
              {profile.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/** Mobile bottom tab bar (sits above the crisis bar). */
export function MobileNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-[calc(3.5rem+4px+env(safe-area-inset-bottom))] z-40 border-t border-line bg-card/95 backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-ink-soft",
                  isActive && "text-primary-dark",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      isActive && "bg-primary-soft",
                    )}
                  >
                    <Icon aria-hidden className="size-5" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
