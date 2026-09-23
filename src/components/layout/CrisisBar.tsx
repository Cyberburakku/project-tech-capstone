import { Phone, LifeBuoy } from "lucide-react";

/** Permanent crisis footer, visible on every page. */
export function CrisisBar() {
  return (
    <aside
      aria-label="Crisis support"
      className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-crisis bg-crisis-strong text-white pb-[env(safe-area-inset-bottom)]"
    >
      <div className="container-app flex min-h-14 items-center justify-between gap-2 py-1.5">
        <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
          <LifeBuoy aria-hidden className="size-5 shrink-0" />
          <span>Need Help Right Now?</span>
        </p>
        <div className="flex items-center gap-2">
          <a
            href="tel:988"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-3 text-sm font-bold text-[#b91c2c] hover:bg-red-50 focus-visible:outline-white sm:px-4 sm:text-base"
            aria-label="Call or text 988, the Suicide and Crisis Lifeline"
          >
            <Phone aria-hidden className="size-4" /> 988
          </a>
          <a
            href="tel:211"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-white px-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-white sm:px-4 sm:text-base"
            aria-label="Call 211 Maine for local help with housing, food, and more"
          >
            <Phone aria-hidden className="size-4" /> 211
          </a>
        </div>
      </div>
    </aside>
  );
}
