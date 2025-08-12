import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default:
          "border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30",
        secondary:
          "border-white/20 dark:border-gray-700/20 bg-white/20 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30",
        destructive:
          "border-red-200/50 dark:border-red-800/50 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 dark:text-red-300 hover:from-red-500/30 hover:to-red-600/30",
        outline: "border-white/30 dark:border-gray-700/30 bg-white/10 dark:bg-gray-800/10 text-foreground hover:bg-white/20 dark:hover:bg-gray-800/20",
        success:
          "border-green-200/50 dark:border-green-800/50 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 hover:from-green-500/30 hover:to-emerald-500/30",
        warning:
          "border-yellow-200/50 dark:border-yellow-800/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30",
        info:
          "border-sky-200/50 dark:border-sky-800/50 bg-gradient-to-r from-sky-500/20 to-blue-500/20 text-sky-700 dark:text-sky-300 hover:from-sky-500/30 hover:to-blue-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
