import type React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:scale-105",
        className
      )}
      {...props}
    />
  );
}
