import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Code2, Database, ListChecks, Sparkles, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    title: "Track Everything",
    description: "Keep every problem, note, confidence score, and revision flag in one place.",
    icon: ListChecks,
    gradient: "from-cyan-500/20 to-blue-500/20"
  },
  {
    title: "Analyze with AI",
    description: "Pull structured summaries, topics, hints, and complexity from OpenRouter-powered analysis.",
    icon: BrainCircuit,
    gradient: "from-violet-500/20 to-purple-500/20"
  },
  {
    title: "Database Backed",
    description: "Persist your archive in Postgres so your data survives refreshes, restarts, and deployments.",
    icon: Database,
    gradient: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "See the Patterns",
    description: "Spot topic bias, confidence trends, and platform distribution with live charts.",
    icon: BarChart3,
    gradient: "from-amber-500/20 to-orange-500/20"
  }
];

const stats = [
  { label: "Platforms", value: "6+", icon: Code2 },
  { label: "AI Models", value: "Free", icon: Sparkles },
  { label: "Export", value: "XLSX", icon: Trophy }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative glass-panel overflow-hidden p-8 md:p-14">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-500/8 blur-[80px]" />

        <div className="relative grid gap-10 xl:grid-cols-[1.4fr,0.6fr]">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200">
              <Zap className="h-3 w-3" />
              CodeTracker Pro
            </div>
            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-6xl gradient-text leading-[1.1]">
                The control center for your competitive programming grind.
              </h1>
              <p className="max-w-2xl text-balance text-lg leading-relaxed text-slate-300">
                Manage every problem you solve, revisit, and almost solve with AI-assisted
                analysis, database-backed persistence, flexible filters, and live stats.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/tracker">
                <Button variant="outline" size="lg">
                  View Tracker
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden xl:flex flex-col justify-center gap-4 animate-fade-in delay-300">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 transition hover:border-cyan-500/30"
                >
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Everything you need</h2>
          <p className="mt-2 text-slate-400">Built for competitive programmers who take practice seriously.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-[0_0_32px_rgba(6,182,212,0.12)] animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <CardHeader className="relative">
                  <div className="mb-4 inline-flex w-fit rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <CardTitle className="transition-colors group-hover:text-cyan-100">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative pt-0" />
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-slate-800/60 pt-8 pb-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-1.5">
              <Zap className="h-4 w-4 text-cyan-300" />
            </div>
            <span className="text-sm font-semibold text-white">CodeTracker Pro</span>
          </div>
          <p className="text-xs text-slate-500">
            Built for competitive programmers. Track, analyze, and improve.
          </p>
        </div>
      </footer>
    </div>
  );
}
