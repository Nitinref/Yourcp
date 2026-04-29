"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Plus, RefreshCcw, Target } from "lucide-react";
import { AddQuestionModal } from "@/components/AddQuestionModal";
import { AuthRequiredNotice } from "@/components/AuthRequiredNotice";
import { PlatformAccountsSection } from "@/components/PlatformAccountsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { platformColors } from "@/constants/platforms";
import { formatDate } from "@/lib/utils";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useSession } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";

export default function DashboardPage() {
  const { status } = useSession();
  const { questions, fetchQuestions, isLoading, error } = useTrackerStore(
    useShallow((state) => ({
      questions: state.questions,
      fetchQuestions: state.fetchQuestions,
      isLoading: state.isLoading,
      error: state.error
    }))
  );
  const [quickInput, setQuickInput] = React.useState("");

  React.useEffect(() => {
    if (status === "authenticated") {
      void fetchQuestions();
    }
  }, [fetchQuestions, status]);

  if (status === "unauthenticated") {
    return (
      <AuthRequiredNotice
        title="Sign in to unlock your dashboard"
        description="Your questions, stats, revisions, and notes are now tied to your Google account in the database."
      />
    );
  }

  const total = questions.length;
  const solved = questions.filter((question) => question.status === "Solved").length;
  const unsolved = questions.filter((question) => question.status === "Unsolved").length;
  const revisionDue = questions.filter((question) => question.revisionFlag).length;
  const recentQuestions = questions.slice(0, 5);

  const statCards = [
    { label: "Total", value: total, icon: Target },
    { label: "Solved", value: solved, icon: Plus },
    { label: "Unsolved", value: unsolved, icon: Clock3 },
    { label: "Revision Due", value: revisionDue, icon: RefreshCcw }
  ];

  return (
    <div className="space-y-10">
      <section className="relative glass-panel overflow-hidden p-6 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/8 blur-[80px]" />

        <div className="relative grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
              <Target className="h-3 w-3" />
              Dashboard
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl gradient-text leading-[1.1]">
                Build a cleaner record of how you practice.
              </h1>
              <p className="max-w-2xl text-slate-300 leading-relaxed">
                Your questions are stored in Postgres, your stats are live, and your
                tracker is ready for every new contest problem or interview drill.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={quickInput}
                onChange={(event) => setQuickInput(event.target.value)}
                placeholder="Paste a problem URL or type a title to quick-add"
                className="h-12 flex-1 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 text-sm text-slate-100 transition-colors focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                disabled={status !== "authenticated"}
              />
              <AddQuestionModal
                prefillInput={quickInput}
                trigger={
                  <Button size="lg">
                    <Plus className="h-4 w-4" />
                    Quick Add
                  </Button>
                }
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tracker">
                <Button variant="outline" className="group">
                  Open Tracker
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/stats">
                <Button variant="ghost">See Stats</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={`group glow-ring transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(6,182,212,0.15)] animate-fade-in-up delay-${(index + 1) * 100}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardDescription>{stat.label}</CardDescription>
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-4 w-4 text-cyan-300" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold">{stat.value}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>The latest five additions to your archive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {status === "loading" || isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="skeleton h-20 w-full" />
                ))}
              </div>
            ) : null}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            {!isLoading && recentQuestions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <Plus className="h-6 w-6 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">
                  No questions saved yet. Add your first problem from the quick-add bar above.
                </p>
              </div>
            ) : null}
            {recentQuestions.map((question, index) => (
              <div
                key={question.id}
                className={`group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 md:flex-row md:items-center md:justify-between animate-fade-in delay-${(index + 1) * 100}`}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={question.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-slate-100 transition hover:text-zinc-200"
                    >
                      {question.title}
                    </a>
                    <Badge className={platformColors[question.platform]}>
                      {question.platform}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">{question.summary}</p>
                </div>
                <div className="whitespace-nowrap text-sm text-slate-500">
                  {formatDate(question.dateAdded)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="animate-fade-in">
        <PlatformAccountsSection />
      </section>
    </div>
  );
}
