"use client";

import * as React from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...item }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur",
              item.variant === "success" &&
                "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
              item.variant === "error" &&
                "border-rose-500/40 bg-rose-500/10 text-rose-100",
              (!item.variant || item.variant === "default") &&
                "border-cyan-500/40 bg-slate-900/90 text-slate-100"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {item.variant === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : item.variant === "error" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.title}</p>
                {item.description ? (
                  <p className="text-xs text-slate-300">{item.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
