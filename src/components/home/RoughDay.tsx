import { useEffect, useRef } from "react";

// Lamp position in the night painting (1536×1024 source), used to anchor the beam.
const LAMP = [1190 / 1536, 300 / 1024];
const RATIO = 1536 / 1024;

/** "Rough day?": night lighthouse with a rotating beam, 988 and 211. Not a sticky bar. */
export function RoughDay() {
  const cardRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLSpanElement>(null);

  // Keep the beam on the lamp for any card size (mirrors object-fit: cover; position 78% 50%).
  useEffect(() => {
    const card = cardRef.current;
    const beam = beamRef.current;
    if (!card || !beam) return;
    const place = () => {
      const cw = card.clientWidth;
      const ch = card.clientHeight;
      const w = Math.max(cw, ch * RATIO);
      const h = w / RATIO;
      const ox = (cw - w) * 0.78;
      const oy = (ch - h) * 0.5;
      beam.style.left = `${ox + LAMP[0] * w}px`;
      beam.style.top = `${oy + LAMP[1] * h}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  return (
    <section aria-labelledby="rough-h" className="h-full">
      <div
        ref={cardRef}
        className="relative isolate h-80 overflow-hidden rounded-3xl bg-[#16242B] text-[#F4EEE4] web:h-full web:min-h-[420px]"
      >
        <img
          src="/art/lighthouse-night.jpg"
          alt=""
          width={960}
          height={640}
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover object-[78%_50%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(14,22,26,.78)_0%,rgba(14,22,26,.35)_55%,rgba(14,22,26,0)_75%),linear-gradient(to_top,rgba(14,22,26,.7),transparent_45%)]"
        />
        <span ref={beamRef} aria-hidden="true" className="pointer-events-none absolute -z-10 size-0">
          <i className="absolute -top-[70px] left-0 h-[140px] w-[420px] origin-[0_50%] animate-[beam-sweep_9s_linear_infinite] bg-[linear-gradient(to_right,rgba(255,222,150,.75),rgba(255,222,150,.18)_45%,rgba(255,222,150,0)_85%)] mix-blend-screen blur-[3px] [clip-path:polygon(0_47%,100%_0,100%_100%,0_53%)]" />
          <b className="absolute -left-[18px] -top-[18px] size-9 animate-[beam-flash_9s_linear_infinite] rounded-full bg-[radial-gradient(circle,rgba(255,230,160,.95),rgba(255,210,120,.35)_45%,transparent_70%)] mix-blend-screen" />
        </span>
        <div className="absolute inset-x-6 bottom-[22px]">
          <h2 id="rough-h" className="text-[30px] leading-tight text-[#F4EEE4]">
            Rough day?
          </h2>
          <p className="mt-1.5 max-w-[15em] text-base text-[#F4EEE4]/85">You don’t have to wait. Free, confidential, 24/7.</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[
              { href: "tel:988", num: "988", label: "Call or text · crisis" },
              { href: "tel:211", num: "211", label: "Everyday needs" },
            ].map((c) => (
              <a
                key={c.num}
                href={c.href}
                aria-label={`${c.num}: ${c.label}`}
                className="flex min-h-16 flex-col justify-center gap-0.5 rounded-2xl border border-[#F4EEE4]/25 bg-[#F4EEE4]/12 px-3.5 py-2.5 backdrop-blur-md backdrop-saturate-150 hover:bg-[#F4EEE4]/20 focus-visible:outline-[#F4EEE4]"
              >
                <b className="font-serif text-2xl font-semibold leading-none" style={{ fontVariationSettings: '"opsz" 48' }}>
                  {c.num}
                </b>
                <span className="text-sm text-[#F4EEE4]/80">{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
