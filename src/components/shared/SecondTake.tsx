import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SecondTakeAvatar({ className = "size-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <circle cx="24" cy="24" r="24" fill="#2EC4B6" />
      <circle cx="24" cy="21" r="12" fill="#FFFBF5" />
      <circle cx="19.5" cy="20" r="2" fill="#264653" />
      <circle cx="28.5" cy="20" r="2" fill="#264653" />
      <path d="M19 25.5c2.8 2.6 7.2 2.6 10 0" stroke="#FF6B35" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M11 40c3-5 8-7 13-7s10 2 13 7" fill="#FFBF69" />
      <path d="M33 8l2 3 3 1-3 1-2 3-1-3-3-1 3-1z" fill="#FFBF69" />
    </svg>
  );
}

/** A speech bubble from Second Take, the reentry coach. */
export function CoachMessage({
  children,
  title = "Second Take",
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("flex items-start gap-3", className)}
    >
      <SecondTakeAvatar className="size-12 shrink-0" />
      <div className="relative rounded-3xl rounded-tl-md border border-primary/30 bg-card p-4 shadow-soft">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary-dark">{title}</p>
        <div className="text-[15px] leading-relaxed text-ink">{children}</div>
      </div>
    </motion.div>
  );
}
