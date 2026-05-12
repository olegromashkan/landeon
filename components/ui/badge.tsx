import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "purple" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-zinc-800 text-zinc-300 border border-zinc-700": variant === "default",
          "bg-purple-900/50 text-purple-300 border border-purple-700/50": variant === "purple",
          "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50": variant === "success",
          "bg-amber-900/50 text-amber-300 border border-amber-700/50": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}
