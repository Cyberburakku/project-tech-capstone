import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useShell } from "@/components/layout/ShellContext";
import { cn } from "@/lib/utils";

/** Meet Second Take: clay mascot over the card corner, what we ask vs never ask. */
export function CoachCard({ to = "/start" }: { to?: string }) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const { still } = useShell();

  // Gentle 3D tilt that follows the pointer or phone tilt.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el || still || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const set = (x: number, y: number) => {
      el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
    };
    const onPointer = (e: PointerEvent) => set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      set(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      set(0, 0);
    };
  }, [still]);

  return (
    <section aria-labelledby="coach-h" className="h-full">
      <div className="relative mt-[84px] h-[calc(100%-84px)] rounded-3xl border border-line bg-card px-[18px] py-[22px] web:px-7 web:py-7">
        <div aria-hidden="true" className="pointer-events-none absolute -top-[88px] left-0 h-[163px] w-[176px] [perspective:600px]">
          <div
            ref={tiltRef}
            className="size-full transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
          >
            <img
              src="/art/second-take-mascot.webp"
              alt=""
              width={360}
              height={333}
              className="size-full origin-[50%_90%] animate-[mascot-bob_5s_ease-in-out_infinite] object-contain"
            />
          </div>
        </div>
        <div className="min-h-[62px] pl-[150px] pt-1.5">
          <h2 id="coach-h" className="text-2xl leading-tight text-ink" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 100' }}>
            Second Take
          </h2>
          <p className="mt-0.5 text-sm text-ink-3">Your reentry coach</p>
        </div>
        <p className="relative mt-[18px] rounded-2xl bg-paper-2 px-[18px] py-4 text-[17px] leading-normal text-ink before:absolute before:-top-[9px] before:left-[66px] before:border-[10px] before:border-t-0 before:border-transparent before:border-b-paper-2 before:content-['']">
          Hi, I’m here to help you get ready, with no judgment. Ever. I only need two things to get started.
        </p>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-sage-soft px-3 pb-3 pt-3.5">
            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.06em] text-ink-2">We ask</h3>
            <ul className="text-base leading-snug text-ink">
              {["First name", "Your county"].map((t) => (
                <li key={t} className="flex items-start gap-2 whitespace-nowrap py-[3px]">
                  <Check aria-hidden="true" className="mt-[3px] size-4 shrink-0 text-sage" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-clay-soft px-3 pb-3 pt-3.5">
            <h3 className="mb-2 text-[13px] font-bold uppercase tracking-[0.06em] text-ink-2">We don’t ask</h3>
            <ul className="text-base leading-snug text-ink">
              {["Your case", "Your record", "Release date"].map((t) => (
                <li key={t} className="flex items-start gap-2 whitespace-nowrap py-[3px]">
                  <X aria-hidden="true" className="mt-[3px] size-4 shrink-0 text-clay" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link to={to} className={cn(buttonVariants({ size: "cta" }), "mt-[22px] w-full")}>
          Say hi to Second Take <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
