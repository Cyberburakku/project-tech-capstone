import { useEffect, useRef } from "react";
import { useShell } from "@/components/layout/ShellContext";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    img: "/art/step-checkin.webp",
    w: 154,
    h: 180,
    title: "Know where you stand",
    text: "A 10-question check-in shows your strengths and what to work on next.",
    meta: "3 minutes",
  },
  {
    img: "/art/step-skills.webp",
    w: 157,
    h: 180,
    title: "Build real skills",
    text: "Short lessons on phones, email, job hunting, and talking about your past.",
    meta: "5 minutes each",
  },
  {
    img: "/art/step-support.webp",
    w: 180,
    h: 125,
    title: "Grow your support",
    text: "Reconnect with people, and find new support you can count on.",
  },
  {
    img: "/art/step-help.webp",
    w: 167,
    h: 180,
    title: "Find trusted help",
    text: "Your top 3 resources in your Maine county, not an endless list.",
  },
];

/**
 * Four steps with clay icons that pop in (3D) as they scroll into view.
 * Icons are only hidden once IntersectionObserver is confirmed, so nothing
 * stays blank if JS or IO is missing, or when motion is paused.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null);
  const { still } = useShell();

  useEffect(() => {
    const list = listRef.current;
    if (!list || still || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const objs = Array.from(list.querySelectorAll<HTMLElement>(".pop-obj"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    // Already on screen? Reveal right away; only hide the ones still below the fold.
    objs.forEach((o, i) => {
      const img = o.querySelector("img");
      if (img) img.style.transitionDelay = `${(i % 2) * 80}ms`;
      if (o.getBoundingClientRect().top < window.innerHeight * 0.88) o.classList.add("in");
      else io.observe(o);
    });
    list.classList.add("js-pop");
    return () => {
      io.disconnect();
      list.classList.remove("js-pop");
      objs.forEach((o) => o.classList.add("in"));
    };
  }, [still]);

  return (
    <section aria-labelledby="how-h">
      <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-3">How it works</p>
      <h2 id="how-h" className="text-[30px] leading-[1.1] text-ink web:text-[38px]">
        Four steps, at your own pace
      </h2>
      <ol ref={listRef} className="mt-6 web:grid web:grid-cols-2 web:gap-x-12 web:gap-y-10">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={cn(
              "relative grid grid-cols-[64px_1fr] gap-4 pb-7 last:pb-0 web:pb-0",
              // dotted clay trail between the steps (phone)
              i < STEPS.length - 1 &&
                "after:absolute after:bottom-1.5 after:left-[31px] after:top-[72px] after:w-0.5 after:bg-[repeating-linear-gradient(to_bottom,var(--color-clay)_0_6px,transparent_6px_13px)] after:opacity-50 after:content-[''] web:after:hidden",
            )}
          >
            <span className="pop-obj grid size-16 place-items-center [perspective:400px]">
              <img
                src={s.img}
                alt=""
                width={s.w}
                height={s.h}
                className="size-[60px] object-contain [transform-style:preserve-3d]"
              />
            </span>
            <div>
              <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.08em] text-action-dark">Step {i + 1}</p>
              <h3 className="text-[19px] font-bold leading-snug text-ink">{s.title}</h3>
              <p className="mt-0.5 text-base leading-normal text-ink-2">{s.text}</p>
              {s.meta && <span className="mt-1.5 inline-block text-sm text-ink-3">{s.meta}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
