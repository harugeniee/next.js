import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const draculaButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        outline:
          "border border-purple-500/30 bg-background hover:bg-purple-500/10 hover:text-purple-400 dark:border-purple-400/30 dark:hover:bg-purple-400/10",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        ghost:
          "hover:bg-purple-500/10 hover:text-purple-400 dark:hover:bg-purple-400/10",
        link: "text-purple-600 underline-offset-4 hover:underline dark:text-purple-400",
        dracula:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25",
        vampire:
          "bg-black text-white border-2 border-purple-500 hover:bg-purple-900 hover:border-purple-400",
        neon: "bg-transparent text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/25",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface DraculaButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof draculaButtonVariants> {}

const DraculaButton = React.forwardRef<HTMLButtonElement, DraculaButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(draculaButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
DraculaButton.displayName = "DraculaButton";

export { DraculaButton, draculaButtonVariants };
