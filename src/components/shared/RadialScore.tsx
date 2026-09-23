import { motion, useReducedMotion } from "framer-motion";

interface RadialScoreProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sublabel?: string;
}

/** Animated radial progress ring with accessible text alternative. */
export function RadialScore({
  value,
  size = 180,
  stroke = 16,
  color = "#2EC4B6",
  track = "var(--color-ring-track)",
  label,
  sublabel,
}: RadialScoreProps) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "Score"}: ${value} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center" aria-hidden>
        <span className="font-extrabold text-ink" style={{ fontSize: size * 0.26, lineHeight: 1 }}>
          {value}
        </span>
        {sublabel && <span className="mt-1 text-xs font-semibold text-ink-soft">{sublabel}</span>}
      </div>
    </div>
  );
}

/** Five concentric rings — one per readiness category. */
export function MultiRing({
  scores,
  size = 220,
  label = "",
}: {
  scores: { key: string; label: string; value: number; color: string }[];
  size?: number;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const stroke = 12;
  const gap = 5;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      role="img"
      aria-label={`${label} ${scores.map((s) => `${s.label} ${s.value}`).join(", ")}`.trim()}
    >
      {scores.map((s, i) => {
        const r = size / 2 - stroke / 2 - i * (stroke + gap);
        const c = 2 * Math.PI * r;
        const offset = c * (1 - s.value / 100);
        return (
          <g key={s.key}>
            <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-ring-track)" strokeWidth={stroke} fill="none" />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={c}
              initial={{ strokeDashoffset: reduce ? offset : c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.1, delay: i * 0.12, ease: "easeOut" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
