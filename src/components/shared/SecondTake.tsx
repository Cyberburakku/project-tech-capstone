import { motion, useReducedMotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

export function SecondTakeAvatar({ className = "size-12" }: { className?: string }) {
  return (
    <img
      src="/art/second-take-mascot.webp"
      alt=""
      aria-hidden="true"
      width={360}
      height={333}
      className={cn("object-contain", className)}
    />
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
  const reduce = useReducedMotionConfig();
  return (
    <motion.div
      initial={reduce ? false : { y: 8 }}
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
