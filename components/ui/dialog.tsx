"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  asChild,
  children
}: {
  asChild?: boolean;
  children: React.ReactElement;
}) {
  const context = React.useContext(DialogContext);
  const child = children as React.ReactElement<{
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  }>;

  if (!context) {
    return children;
  }

  if (!asChild) {
    return (
      <button type="button" onClick={() => context.setOpen(true)}>
        {children}
      </button>
    );
  }

  return React.cloneElement(children, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      context.setOpen(true);
    }
  });
}

export function DialogContent({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(DialogContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted || !context?.open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={cn(
          "relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl",
          className
        )}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          aria-label="Close dialog"
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

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-semibold", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-400", className)} {...props} />;
}
