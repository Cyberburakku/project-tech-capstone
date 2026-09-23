import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold transition-all select-none disabled:pointer-events-none disabled:opacity-50 active:translate-y-[2px] active:shadow-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-action-strong text-white shadow-[0_4px_0_0_#8f2f09] hover:bg-[#b03a0a]",
        primary: "bg-primary-strong text-white shadow-[0_4px_0_0_#10534d] hover:bg-[#11564f]",
        secondary:
          "bg-card text-ink border-2 border-line shadow-[0_4px_0_0_var(--color-line)] hover:border-primary hover:bg-primary-soft",
        ghost: "text-ink hover:bg-muted",
        link: "text-primary-dark underline-offset-4 hover:underline px-0 h-auto",
        crisis: "bg-white text-[#b91c2c] hover:bg-red-50",
      },
      size: {
        default: "min-h-12 px-6 py-3 text-base",
        sm: "min-h-11 px-4 text-sm",
        lg: "min-h-14 px-8 text-lg",
        icon: "size-12",
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
