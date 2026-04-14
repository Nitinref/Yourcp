"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "danger";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.22)]",
  outline:
    "border border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400 hover:text-cyan-300",
  ghost: "bg-transparent text-slate-200 hover:bg-slate-800/80",
  danger:
    "bg-rose-500/90 text-white hover:bg-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.18)]"
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-lg px-3",
  lg: "h-11 rounded-xl px-6",
  icon: "h-10 w-10"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
