import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function Spinner({ size = "default", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-2 border-current border-t-transparent animate-spin",
        {
          "w-4 h-4": size === "sm",
          "w-5 h-5": size === "default",
          "w-8 h-8": size === "lg",
        },
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
