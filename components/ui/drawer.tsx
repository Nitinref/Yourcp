"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export function Drawer({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DrawerContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerContent({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DrawerContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted || !context?.open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70"
        aria-label="Close drawer"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-slate-800 bg-slate-950 p-6 shadow-2xl",
          className
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          aria-label="Close drawer"
          onClick={() => context.setOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DrawerTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-semibold", className)} {...props} />;
}

export function DrawerDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-400", className)} {...props} />;
}
