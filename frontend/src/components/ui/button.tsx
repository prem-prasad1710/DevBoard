import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl",
        outline:
          "border border-white/20 dark:border-gray-700/20 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md hover:bg-white/20 dark:hover:bg-gray-800/20 hover:border-white/30 dark:hover:border-gray-700/30 shadow-sm hover:shadow-md",
        secondary:
          "bg-white/20 dark:bg-gray-800/20 text-gray-900 dark:text-white border border-white/10 dark:border-gray-700/10 backdrop-blur-md hover:bg-white/30 dark:hover:bg-gray-800/30 shadow-sm hover:shadow-md",
        ghost: "hover:bg-white/10 dark:hover:bg-gray-800/10 backdrop-blur-sm hover:shadow-sm border border-transparent hover:border-white/10 dark:hover:border-gray-700/10",
        link: "text-primary underline-offset-4 hover:underline backdrop-blur-sm",
        glass: "bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl backdrop-saturate-150 border border-white/30 dark:border-gray-700/30 shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 hover:shadow-xl transform hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
