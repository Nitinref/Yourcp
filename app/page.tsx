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
        <div className="max-w-3xl space-y-5">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Turn practice into an interview-ready system
          </h2>
          <p className="max-w-2xl text-lg text-slate-300">
            Keep each problem, mistake pattern, and revision signal in one workflow.
            Analyze with AI, track confidence, and export clean sheets whenever needed.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
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
            <Card key={card.title} className="transition hover:-translate-y-1 hover:border-zinc-400/40">
              <CardHeader>
                <div className="mb-4 inline-flex w-fit rounded-2xl border border-zinc-500/20 bg-zinc-300/10 p-3">
                  <Icon className="h-5 w-5 text-zinc-200" />
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
