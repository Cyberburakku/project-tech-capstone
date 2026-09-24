import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-bold transition-all select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-[5px] active:shadow-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-clay-btn text-white shadow-[0_5px_0_0_var(--color-clay-press),0_14px_30px_-12px_rgba(131,49,27,0.5)] hover:[&_svg]:translate-x-[3px] [&_svg]:transition-transform",
        primary: "bg-primary-strong text-white shadow-[0_5px_0_0_color-mix(in_srgb,var(--color-primary-strong)_60%,black)]",
        secondary:
          "bg-card text-ink border-2 border-line hover:border-sage hover:bg-sage-soft active:translate-y-0",
        ghost: "text-ink hover:bg-muted",
        link: "text-sage underline decoration-2 underline-offset-[5px] px-0 h-auto",
        crisis: "bg-white text-clay-press hover:bg-clay-soft",
      },
      size: {
        default: "min-h-12 px-6 py-3 text-base",
        sm: "min-h-11 px-4 text-sm",
        lg: "min-h-14 px-8 text-lg",
        icon: "size-12",
        cta: "h-[58px] px-7 text-[19px] tracking-[0.005em] [&_svg]:size-[22px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
