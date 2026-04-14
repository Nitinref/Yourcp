"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, ListChecks, Menu, X, Zap } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tracker", label: "Tracker", icon: ListChecks },
  { href: "/stats", label: "Stats", icon: BarChart3 }
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-2 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Zap className="h-5 w-5 text-cyan-300 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white">
              CodeTracker Pro
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Competitive Programming
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex gap-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.25)]"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-2 h-6 w-px bg-slate-800" />
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/60 hover:text-white md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="animate-fade-in border-t border-slate-800/60 bg-slate-950/95 px-4 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(6,182,212,0.25)]"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 border-t border-slate-800/60 pt-3">
            <AuthButton />
          </div>
        </div>
      ) : null}
    </header>
  );
}
