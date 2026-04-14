import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Database, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const featureCards = [
  {
    title: "Track Everything",
    description: "Keep every problem, note, confidence score, and revision flag in one place.",
    icon: ListChecks
  },
  {
    title: "Analyze with AI",
    description: "Pull structured summaries, topics, hints, and complexity from OpenRouter-powered analysis.",
    icon: BrainCircuit
  },
  {
    title: "Database Backed",
    description: "Persist your archive in Postgres so your data survives refreshes, restarts, and deployments.",
    icon: Database
  },
  {
    title: "See the Patterns",
    description: "Spot topic bias, confidence trends, and platform distribution with live charts.",
    icon: BarChart3
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="glass-panel overflow-hidden p-8 md:p-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-cyan-200">
            CodeTracker Pro
          </div>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              The original control center for your competitive programming grind.
            </h1>
            <p className="max-w-2xl text-balance text-lg text-slate-300">
              Manage every problem you solve, revisit, and almost solve with AI-assisted
              analysis, database-backed persistence, flexible filters, and live stats.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button size="lg">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tracker">
              <Button variant="outline" size="lg">
                View Tracker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="transition hover:-translate-y-1 hover:border-cyan-500/40">
              <CardHeader>
                <div className="mb-4 inline-flex w-fit rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0" />
            </Card>
          );
        })}
      </section>
    </div>
  );
}
