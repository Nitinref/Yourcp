"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileSpreadsheet, LayoutDashboard, ListChecks, Zap } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tracker", label: "Tracker", icon: ListChecks },
  { href: "/make-your-own-sheet", label: "Make Sheet", icon: FileSpreadsheet },
  { href: "/stats", label: "Stats", icon: BarChart3 }
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="rounded-2xl border border-zinc-500/30 bg-zinc-300/10 p-2">
            <Zap className="h-5 w-5 text-zinc-200" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">
              CodeTracker Pro
            </div>
            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Competitive Programming Manager
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-zinc-100 text-zinc-950 shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                      : "border border-slate-800 bg-slate-900 text-slate-300 hover:border-zinc-400/40 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
