import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex min-h-12 w-full rounded-2xl border-2 border-input bg-white px-4 py-3 text-base text-ink placeholder:text-ink-soft/70 transition-colors focus-visible:border-primary-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-crisis",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
