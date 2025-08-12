import * as React from "react"
import { cn } from "@/lib/utils"

const MobileCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glassmorphism" | "compact";
    padding?: "none" | "sm" | "md" | "lg";
  }
>(({ className, variant = "default", padding = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border text-card-foreground shadow transition-all duration-200",
      // Base styles
      variant === "default" && "bg-card border-border",
      // Glassmorphism variant
      variant === "glassmorphism" && "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 border-white/20 dark:border-gray-800/20 shadow-lg",
      // Compact variant for mobile
      variant === "compact" && "bg-card/80 backdrop-blur-sm border-border/50 shadow-sm",
      // Padding variants
      padding === "none" && "p-0",
      padding === "sm" && "p-3 sm:p-4",
      padding === "md" && "p-4 sm:p-6",
      padding === "lg" && "p-6 sm:p-8",
      // Mobile-first responsive design
      "hover:shadow-md active:scale-[0.98] sm:active:scale-100 sm:hover:scale-[1.02]",
      className
    )}
    {...props}
  />
))
MobileCard.displayName = "MobileCard"

const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: "none" | "sm" | "md" | "lg";
  }
>(({ className, spacing = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      spacing === "none" && "space-y-0",
      spacing === "sm" && "space-y-1",
      spacing === "md" && "space-y-1.5",
      spacing === "lg" && "space-y-2",
      className
    )}
    {...props}
  />
))
MobileCardHeader.displayName = "MobileCardHeader"

const MobileCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: "sm" | "md" | "lg" | "xl";
    truncate?: boolean;
  }
>(({ className, size = "md", truncate = false, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-foreground",
      // Size variants - mobile first
      size === "sm" && "text-sm sm:text-base",
      size === "md" && "text-base sm:text-lg",
      size === "lg" && "text-lg sm:text-xl",
      size === "xl" && "text-xl sm:text-2xl",
      // Truncation
      truncate && "truncate",
      className
    )}
    {...props}
  />
))
MobileCardTitle.displayName = "MobileCardTitle"

const MobileCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    size?: "sm" | "md";
    lines?: 1 | 2 | 3 | 4;
  }
>(({ className, size = "md", lines, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-muted-foreground leading-relaxed",
      // Size variants
      size === "sm" && "text-xs sm:text-sm",
      size === "md" && "text-sm sm:text-base",
      // Line clamping for mobile
      lines === 1 && "line-clamp-1",
      lines === 2 && "line-clamp-2",
      lines === 3 && "line-clamp-3",
      lines === 4 && "line-clamp-4",
      className
    )}
    {...props}
  />
))
MobileCardDescription.displayName = "MobileCardDescription"

const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: "none" | "sm" | "md" | "lg";
  }
>(({ className, spacing = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Spacing variants
      spacing === "none" && "pt-0",
      spacing === "sm" && "pt-2 sm:pt-3",
      spacing === "md" && "pt-3 sm:pt-4",
      spacing === "lg" && "pt-4 sm:pt-6",
      className
    )}
    {...props}
  />
))
MobileCardContent.displayName = "MobileCardContent"

const MobileCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "col";
    justify?: "start" | "center" | "end" | "between";
    spacing?: "none" | "sm" | "md" | "lg";
  }
>(({ className, direction = "row", justify = "start", spacing = "md", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center",
      // Direction
      direction === "row" && "flex-row flex-wrap gap-2",
      direction === "col" && "flex-col space-y-2",
      // Justify content
      justify === "start" && "justify-start",
      justify === "center" && "justify-center",
      justify === "end" && "justify-end",
      justify === "between" && "justify-between",
      // Spacing variants
      spacing === "none" && "pt-0",
      spacing === "sm" && "pt-2 sm:pt-3",
      spacing === "md" && "pt-3 sm:pt-4",
      spacing === "lg" && "pt-4 sm:pt-6",
      className
    )}
    {...props}
  />
))
MobileCardFooter.displayName = "MobileCardFooter"

// Grid component for responsive card layouts
const MobileCardGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cols?: 1 | 2 | 3 | 4;
    gap?: "none" | "sm" | "md" | "lg";
    minCardWidth?: string;
  }
>(({ className, cols = 1, gap = "md", minCardWidth = "280px", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid w-full",
      // Responsive columns with auto-fit for mobile
      "grid-cols-1",
      cols >= 2 && "sm:grid-cols-2",
      cols >= 3 && "lg:grid-cols-3",
      cols >= 4 && "xl:grid-cols-4",
      // Gap variants
      gap === "none" && "gap-0",
      gap === "sm" && "gap-2 sm:gap-3",
      gap === "md" && "gap-4 sm:gap-6",
      gap === "lg" && "gap-6 sm:gap-8",
      className
    )}
    style={{
      gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}, 1fr))`
    }}
    {...props}
  />
))
MobileCardGrid.displayName = "MobileCardGrid"

// Stats card component optimized for mobile
const MobileStatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
      value: string;
      isPositive: boolean;
    };
    variant?: "default" | "glassmorphism";
  }
>(({ className, title, value, description, icon, trend, variant = "default", ...props }, ref) => (
  <MobileCard ref={ref} variant={variant} className={className} {...props}>
    <MobileCardContent spacing="sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center mt-2">
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
            trend.isPositive 
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          )}>
            {trend.isPositive ? "↗" : "↘"} {trend.value}
          </span>
        </div>
      )}
    </MobileCardContent>
  </MobileCard>
))
MobileStatsCard.displayName = "MobileStatsCard"

export { 
  MobileCard, 
  MobileCardHeader, 
  MobileCardFooter, 
  MobileCardTitle, 
  MobileCardDescription, 
  MobileCardContent,
  MobileCardGrid,
  MobileStatsCard
}
