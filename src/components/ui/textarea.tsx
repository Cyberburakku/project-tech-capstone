import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-32 w-full rounded-2xl border-2 border-input bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 focus-visible:border-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
