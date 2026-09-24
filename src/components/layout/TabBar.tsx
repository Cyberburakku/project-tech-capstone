import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { cn } from "@/lib/utils";

/** Fixed bottom tab bar for the phone chrome (hidden on the web layout). */
export function TabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-line bg-paper/95 px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md backdrop-saturate-150 web:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-14 flex-col items-center gap-[3px] pb-1 pt-2 text-[13px] font-bold text-ink-2 [&_svg]:size-[26px]",
                  isActive &&
                    "text-ink before:absolute before:-top-1.5 before:h-[3px] before:w-7 before:rounded-b-[3px] before:bg-clay before:content-['']",
                )
              }
            >
              <Icon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
