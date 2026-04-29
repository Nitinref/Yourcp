"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidenceStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

export function ConfidenceStars({
  value,
  onChange,
  size = "md"
}: ConfidenceStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            className={cn(
              "transition",
              onChange ? "cursor-pointer hover:scale-110" : "cursor-default",
              size === "sm" ? "h-4 w-4" : "h-5 w-5"
            )}
            onClick={() => onChange?.(starValue)}
          >
            <Star
              className={cn(
                "h-full w-full",
                active
                  ? "fill-zinc-200 text-zinc-200"
                  : "text-slate-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
